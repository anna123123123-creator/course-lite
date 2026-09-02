(function () {
  'use strict';

  var data = CourseData.load();

  var balanceBadge = document.getElementById('balanceBadge');
  var catalogView = document.getElementById('view-catalog');
  var detailView = document.getElementById('view-detail');
  var courseGrid = document.getElementById('courseGrid');
  var categoryFilters = document.getElementById('categoryFilters');
  var priceFilter = document.getElementById('priceFilter');

  var currentCategory = 'all';
  var currentCourseId = null;

  function renderBalance() {
    balanceBadge.textContent = '钱包余额 ¥' + data.wallet.balance;
  }

  function categories() {
    var set = {};
    data.courses.forEach(function (c) { set[c.category] = true; });
    return Object.keys(set);
  }

  function renderCategoryFilters() {
    var cats = ['all'].concat(categories());
    categoryFilters.innerHTML = cats.map(function (c) {
      return '<button class="filter-btn' + (c === currentCategory ? ' active' : '') + '" data-cat="' + c + '">' +
        (c === 'all' ? '全部分类' : c) + '</button>';
    }).join('');
    categoryFilters.querySelectorAll('.filter-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        currentCategory = btn.dataset.cat;
        renderCategoryFilters();
        renderGrid();
      });
    });
  }

  function matchesPrice(price) {
    var v = priceFilter.value;
    if (v === 'low') return price <= 50;
    if (v === 'mid') return price > 50 && price <= 150;
    if (v === 'high') return price > 150;
    return true;
  }

  function renderGrid() {
    var list = data.courses.filter(function (c) {
      return (currentCategory === 'all' || c.category === currentCategory) && matchesPrice(c.price);
    });
    courseGrid.innerHTML = list.map(function (c) {
      var lessons = CourseData.lessonsForCourse(data, c.id);
      var owned = CourseData.isEnrolled(data, c.id);
      return '<div class="course-card" data-id="' + c.id + '">' +
        '<div class="course-card__cover">' + c.coverEmoji + '</div>' +
        '<div class="course-card__body">' +
        '<div class="course-card__tags"><span class="tag">' + c.category + '</span>' + (owned ? '<span class="tag owned">已购买</span>' : '') + '</div>' +
        '<h3>' + c.title + '</h3>' +
        '<div class="course-card__meta">' + c.instructor + ' 讲师 · ' + lessons.length + ' 课时</div>' +
        '<div class="course-card__price">¥' + c.price + '</div>' +
        '</div></div>';
    }).join('') || '<p class="empty-hint">没有符合条件的课程。</p>';

    courseGrid.querySelectorAll('.course-card').forEach(function (card) {
      card.addEventListener('click', function () { openDetail(card.dataset.id); });
    });
  }

  priceFilter.addEventListener('change', renderGrid);

  function openDetail(courseId) {
    currentCourseId = courseId;
    renderDetail();
    catalogView.classList.remove('active');
    detailView.classList.add('active');
    window.scrollTo(0, 0);
  }

  function backToCatalog() {
    detailView.classList.remove('active');
    catalogView.classList.add('active');
    currentCourseId = null;
  }

  function renderDetail() {
    var course = data.courses.find(function (c) { return c.id === currentCourseId; });
    if (!course) { detailView.innerHTML = '<p class="empty-hint">课程不存在，可能已被下架。</p>'; return; }

    var lessons = CourseData.lessonsForCourse(data, course.id);
    var owned = CourseData.isEnrolled(data, course.id);
    var stats = CourseData.courseProgress(data, course.id);

    var html = '<button class="btn btn-back" id="btnBackCatalog">← 返回课程列表</button>';
    html += '<div class="course-detail-head">';
    html += '<div class="course-detail-cover">' + course.coverEmoji + '</div>';
    html += '<div class="course-detail-info">';
    html += '<h1>' + course.title + '</h1>';
    html += '<div class="course-detail-meta">' + course.instructor + ' 讲师 · ' + course.category + ' · ' + lessons.length + ' 课时</div>';
    html += owned ? '<span class="tag owned">已购买</span>' : '<div class="course-detail-price">¥' + course.price + '</div>';
    html += '</div></div>';
    html += '<p class="course-detail-desc">' + course.description + '</p>';

    if (owned) {
      var pct = stats.total ? Math.round(stats.completed / stats.total * 100) : 0;
      html += '<div class="progress-wrap">';
      html += '<div class="progress-label" id="progressLabel">学习进度：' + stats.completed + ' / ' + stats.total + ' 课时（' + pct + '%）</div>';
      html += '<div class="progress-bar"><div class="progress-bar__fill" style="width:' + pct + '%"></div></div>';
      html += '</div>';
    } else {
      html += '<div class="purchase-panel"><div id="purchaseMsg"></div><button class="btn btn-primary" id="btnPurchase">购买课程 · ¥' + course.price + '</button></div>';
    }

    html += '<div class="lesson-list">';
    lessons.forEach(function (l) {
      var unlocked = owned || l.isPreview;
      var done = false;
      if (owned) {
        var pg = data.progress.find(function (p) { return p.courseId === course.id && p.lessonId === l.id; });
        done = !!(pg && pg.completed);
      }
      html += '<div class="lesson-row' + (unlocked ? '' : ' locked') + '" data-lesson="' + l.id + '">';
      html += '<div class="lesson-row__main">';
      html += '<span class="lesson-index">' + l.index + '</span>';
      html += '<span class="lesson-title">' + l.title + (l.isPreview ? ' <span class="badge-preview">试看</span>' : '') + '</span>';
      html += '<span class="lesson-duration">' + l.durationMinutes + ' 分钟</span>';
      if (!unlocked) {
        html += '<span class="lock-icon">🔒</span>';
      }
      if (owned) {
        html += '<label class="check-complete"><input type="checkbox" data-complete="' + l.id + '"' + (done ? ' checked' : '') + '> 标记完成</label>';
      }
      html += '</div>';
      if (unlocked) {
        html += '<div class="lesson-content" hidden>' + l.content + '</div>';
      } else {
        html += '<div class="lesson-locked-hint">购买课程后可解锁本课时</div>';
      }
      html += '</div>';
    });
    html += '</div>';

    detailView.innerHTML = html;

    document.getElementById('btnBackCatalog').addEventListener('click', backToCatalog);

    detailView.querySelectorAll('.lesson-row:not(.locked)').forEach(function (row) {
      row.querySelector('.lesson-row__main').addEventListener('click', function (e) {
        if (e.target.tagName === 'INPUT' || e.target.closest('.check-complete')) return;
        var content = row.querySelector('.lesson-content');
        if (content) content.hidden = !content.hidden;
      });
    });

    detailView.querySelectorAll('[data-complete]').forEach(function (cb) {
      cb.addEventListener('click', function (e) { e.stopPropagation(); });
      cb.addEventListener('change', function () {
        toggleComplete(course.id, cb.dataset.complete, cb.checked);
      });
    });

    var btnPurchase = document.getElementById('btnPurchase');
    if (btnPurchase) {
      btnPurchase.addEventListener('click', function () { purchaseCourse(course); });
    }
  }

  function toggleComplete(courseId, lessonId, checked) {
    var pg = data.progress.find(function (p) { return p.courseId === courseId && p.lessonId === lessonId; });
    if (!pg) {
      pg = { id: CourseData.uid('pg'), courseId: courseId, lessonId: lessonId, completed: false, completedAt: null };
      data.progress.push(pg);
    }
    pg.completed = checked;
    pg.completedAt = checked ? new Date().toISOString() : null;
    CourseData.save(data);
    renderDetail();
  }

  function purchaseCourse(course) {
    var msg = document.getElementById('purchaseMsg');
    if (data.wallet.balance < course.price) {
      var shortfall = Math.round((course.price - data.wallet.balance) * 100) / 100;
      msg.innerHTML = '<div class="msg error">余额不足，还差 ¥' + shortfall + '（当前余额 ¥' + data.wallet.balance + '，课程价格 ¥' + course.price + '）。</div>';
      return;
    }
    data.wallet.balance = Math.round((data.wallet.balance - course.price) * 100) / 100;
    data.enrollments.push({ id: CourseData.uid('e'), courseId: course.id, purchasedAt: new Date().toISOString() });
    CourseData.save(data);
    renderBalance();
    renderDetail();
    renderGrid();
  }

  renderBalance();
  renderCategoryFilters();
  renderGrid();
})();
