(function () {
  'use strict';

  var data = CourseData.load();

  var sideLinks = document.querySelectorAll('.side-link[data-view]');
  var views = document.querySelectorAll('.admin-view');

  function switchView(name) {
    sideLinks.forEach(function (l) { l.classList.toggle('active', l.dataset.view === name); });
    views.forEach(function (v) { v.classList.toggle('active', v.id === 'view-' + name); });
    if (name === 'dashboard') renderDashboard();
    if (name === 'courses') renderCourses();
    if (name === 'lessons') renderLessonsView();
  }

  sideLinks.forEach(function (l) {
    l.addEventListener('click', function () { switchView(l.dataset.view); });
  });

  document.getElementById('btnResetData').addEventListener('click', function () {
    if (!confirm('确定要重置成示例数据吗？这会清空你新增/修改的所有内容。')) return;
    data = CourseData.reset();
    switchView('dashboard');
  });

  function courseById(id) {
    return data.courses.find(function (c) { return c.id === id; });
  }

  function courseName(id) {
    var c = courseById(id);
    return c ? c.title : '（已删除课程）';
  }

  // ---------- Dashboard ----------
  function computeCompletion() {
    var completedSum = 0, totalSum = 0;
    data.enrollments.forEach(function (e) {
      var lessons = CourseData.lessonsForCourse(data, e.courseId);
      totalSum += lessons.length;
      lessons.forEach(function (l) {
        var pg = data.progress.find(function (p) { return p.courseId === e.courseId && p.lessonId === l.id; });
        if (pg && pg.completed) completedSum++;
      });
    });
    return { completed: completedSum, total: totalSum, rate: totalSum ? (completedSum / totalSum * 100) : 0 };
  }

  function enrollmentPrice(e) {
    var c = courseById(e.courseId);
    return c ? c.price : 0;
  }

  function renderDashboard() {
    var now = new Date();
    var ym = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');

    var totalRevenue = data.enrollments.reduce(function (sum, e) { return sum + enrollmentPrice(e); }, 0);
    var monthRevenue = data.enrollments
      .filter(function (e) { return e.purchasedAt.slice(0, 7) === ym; })
      .reduce(function (sum, e) { return sum + enrollmentPrice(e); }, 0);
    var completion = computeCompletion();

    var stats = [
      { label: '课程总数', value: data.courses.length },
      { label: '总购课数', value: data.enrollments.length },
      { label: '总收入', value: '¥' + round2(totalRevenue) },
      { label: '本月收入', value: '¥' + round2(monthRevenue) },
      { label: '平均完成率', value: round2(completion.rate) + '%' },
    ];
    document.getElementById('statGrid').innerHTML = stats.map(function (s) {
      return '<div class="stat-card"><div class="num">' + s.value + '</div><div class="label">' + s.label + '</div></div>';
    }).join('');

    var recent = data.enrollments.slice().sort(function (a, b) { return b.purchasedAt < a.purchasedAt ? -1 : 1; }).slice(0, 6);
    document.getElementById('recentEnrollmentsBody').innerHTML = recent.map(function (e) {
      return '<tr><td>本地学员</td><td>' + courseName(e.courseId) + '</td><td>' + e.purchasedAt.slice(0, 10) + '</td><td>¥' + enrollmentPrice(e) + '</td></tr>';
    }).join('') || '<tr><td colspan="4" style="color:var(--muted)">暂无购课记录</td></tr>';
  }

  function round2(n) {
    return Math.round(n * 100) / 100;
  }

  // ---------- Courses ----------
  var courseModalBackdrop = document.getElementById('courseModalBackdrop');
  var courseModalTitle = document.getElementById('courseModalTitle');
  var courseModalMsg = document.getElementById('courseModalMsg');
  var courseForm = document.getElementById('courseForm');
  var courseIdInput = document.getElementById('courseIdInput');
  var courseTitleInput = document.getElementById('courseTitleInput');
  var courseInstructorInput = document.getElementById('courseInstructorInput');
  var courseCategoryInput = document.getElementById('courseCategoryInput');
  var coursePriceInput = document.getElementById('coursePriceInput');
  var courseEmojiInput = document.getElementById('courseEmojiInput');
  var courseDescInput = document.getElementById('courseDescInput');

  function renderCourses() {
    document.getElementById('coursesBody').innerHTML = data.courses.map(function (c) {
      var lessons = CourseData.lessonsForCourse(data, c.id);
      return '<tr><td>' + c.coverEmoji + ' ' + c.title + '</td><td>' + c.instructor + '</td><td>' + c.category + '</td><td>¥' + c.price + '</td><td>' + lessons.length + ' 课时</td>' +
        '<td class="table-actions">' +
        '<button class="btn btn-sm" data-edit="' + c.id + '">编辑</button>' +
        '<button class="btn btn-sm btn-danger" data-delete="' + c.id + '">删除</button>' +
        '</td></tr>';
    }).join('') || '<tr><td colspan="6" style="color:var(--muted)">暂无课程</td></tr>';

    document.querySelectorAll('[data-edit]').forEach(function (btn) {
      btn.addEventListener('click', function () { openCourseModal(btn.dataset.edit); });
    });
    document.querySelectorAll('[data-delete]').forEach(function (btn) {
      btn.addEventListener('click', function () { deleteCourse(btn.dataset.delete); });
    });
  }

  function openCourseModal(id) {
    courseModalMsg.innerHTML = '';
    courseForm.reset();
    if (id) {
      var c = courseById(id);
      courseModalTitle.textContent = '编辑课程';
      courseIdInput.value = c.id;
      courseTitleInput.value = c.title;
      courseInstructorInput.value = c.instructor;
      courseCategoryInput.value = c.category;
      coursePriceInput.value = c.price;
      courseEmojiInput.value = c.coverEmoji || '';
      courseDescInput.value = c.description || '';
    } else {
      courseModalTitle.textContent = '新增课程';
      courseIdInput.value = '';
    }
    courseModalBackdrop.classList.add('show');
  }

  document.getElementById('btnAddCourse').addEventListener('click', function () { openCourseModal(null); });
  document.getElementById('btnCloseCourseModal').addEventListener('click', function () { courseModalBackdrop.classList.remove('show'); });
  courseModalBackdrop.addEventListener('click', function (e) { if (e.target === courseModalBackdrop) courseModalBackdrop.classList.remove('show'); });

  courseForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var title = courseTitleInput.value.trim();
    var instructor = courseInstructorInput.value.trim();
    var category = courseCategoryInput.value.trim();
    var price = parseFloat(coursePriceInput.value);
    var emoji = courseEmojiInput.value.trim() || '📘';
    var desc = courseDescInput.value.trim();

    if (!title || !instructor || !category || !(price >= 0)) {
      courseModalMsg.innerHTML = '<div class="msg error">请完整填写课程标题、讲师、分类，价格需大于等于 0。</div>';
      return;
    }

    var id = courseIdInput.value;
    if (id) {
      var c = courseById(id);
      c.title = title; c.instructor = instructor; c.category = category; c.price = price; c.coverEmoji = emoji; c.description = desc;
    } else {
      data.courses.push({
        id: CourseData.uid('c'), title: title, instructor: instructor, category: category,
        price: price, coverEmoji: emoji, description: desc,
      });
    }
    CourseData.save(data);
    courseModalBackdrop.classList.remove('show');
    renderCourses();
    populateLessonCourseSelect();
  });

  function deleteCourse(id) {
    if (!confirm('确定删除这门课程吗？它的所有课时也会一并删除，已购课学员的购课记录会保留但显示为"已删除课程"。')) return;
    data.courses = data.courses.filter(function (c) { return c.id !== id; });
    data.lessons = data.lessons.filter(function (l) { return l.courseId !== id; });
    CourseData.save(data);
    renderCourses();
    populateLessonCourseSelect();
  }

  // ---------- Lessons ----------
  var lessonCourseSelect = document.getElementById('lessonCourseSelect');
  var currentLessonCourseId = null;

  var lessonModalBackdrop = document.getElementById('lessonModalBackdrop');
  var lessonModalTitle = document.getElementById('lessonModalTitle');
  var lessonModalMsg = document.getElementById('lessonModalMsg');
  var lessonForm = document.getElementById('lessonForm');
  var lessonIdInput = document.getElementById('lessonIdInput');
  var lessonTitleInput = document.getElementById('lessonTitleInput');
  var lessonDurationInput = document.getElementById('lessonDurationInput');
  var lessonPreviewInput = document.getElementById('lessonPreviewInput');
  var lessonContentInput = document.getElementById('lessonContentInput');

  function populateLessonCourseSelect() {
    var prev = currentLessonCourseId;
    lessonCourseSelect.innerHTML = data.courses.map(function (c) {
      return '<option value="' + c.id + '">' + c.title + '</option>';
    }).join('');
    if (!data.courses.length) {
      currentLessonCourseId = null;
      return;
    }
    currentLessonCourseId = (prev && courseById(prev)) ? prev : data.courses[0].id;
    lessonCourseSelect.value = currentLessonCourseId;
  }

  lessonCourseSelect.addEventListener('change', function () {
    currentLessonCourseId = lessonCourseSelect.value;
    renderLessonsTable();
  });

  function renderLessonsView() {
    populateLessonCourseSelect();
    renderLessonsTable();
  }

  function renderLessonsTable() {
    if (!currentLessonCourseId) {
      document.getElementById('lessonsBody').innerHTML = '<tr><td colspan="5" style="color:var(--muted)">请先在"课程管理"中新增一门课程</td></tr>';
      return;
    }
    var lessons = CourseData.lessonsForCourse(data, currentLessonCourseId);
    document.getElementById('lessonsBody').innerHTML = lessons.map(function (l) {
      return '<tr><td>' + l.index + '</td><td>' + l.title + '</td><td>' + l.durationMinutes + ' 分钟</td><td>' + (l.isPreview ? '<span class="badge-preview">是</span>' : '否') + '</td>' +
        '<td class="table-actions">' +
        '<button class="btn btn-sm" data-edit="' + l.id + '">编辑</button>' +
        '<button class="btn btn-sm btn-danger" data-delete="' + l.id + '">删除</button>' +
        '</td></tr>';
    }).join('') || '<tr><td colspan="5" style="color:var(--muted)">这门课程暂无课时</td></tr>';

    document.querySelectorAll('#lessonsBody [data-edit]').forEach(function (btn) {
      btn.addEventListener('click', function () { openLessonModal(btn.dataset.edit); });
    });
    document.querySelectorAll('#lessonsBody [data-delete]').forEach(function (btn) {
      btn.addEventListener('click', function () { deleteLesson(btn.dataset.delete); });
    });
  }

  function openLessonModal(id) {
    lessonModalMsg.innerHTML = '';
    lessonForm.reset();
    if (id) {
      var l = data.lessons.find(function (x) { return x.id === id; });
      lessonModalTitle.textContent = '编辑课时';
      lessonIdInput.value = l.id;
      lessonTitleInput.value = l.title;
      lessonDurationInput.value = l.durationMinutes;
      lessonPreviewInput.checked = !!l.isPreview;
      lessonContentInput.value = l.content;
    } else {
      lessonModalTitle.textContent = '新增课时';
      lessonIdInput.value = '';
    }
    lessonModalBackdrop.classList.add('show');
  }

  document.getElementById('btnAddLesson').addEventListener('click', function () {
    if (!currentLessonCourseId) {
      alert('请先在"课程管理"中新增一门课程。');
      return;
    }
    openLessonModal(null);
  });
  document.getElementById('btnCloseLessonModal').addEventListener('click', function () { lessonModalBackdrop.classList.remove('show'); });
  lessonModalBackdrop.addEventListener('click', function (e) { if (e.target === lessonModalBackdrop) lessonModalBackdrop.classList.remove('show'); });

  lessonForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var title = lessonTitleInput.value.trim();
    var duration = parseInt(lessonDurationInput.value, 10);
    var isPreview = lessonPreviewInput.checked;
    var content = lessonContentInput.value.trim();

    if (!title || !(duration > 0) || !content) {
      lessonModalMsg.innerHTML = '<div class="msg error">请完整填写课时标题与内容简介，时长需大于 0。</div>';
      return;
    }

    var id = lessonIdInput.value;
    if (id) {
      var l = data.lessons.find(function (x) { return x.id === id; });
      l.title = title; l.durationMinutes = duration; l.isPreview = isPreview; l.content = content;
    } else {
      var existing = CourseData.lessonsForCourse(data, currentLessonCourseId);
      data.lessons.push({
        id: CourseData.uid('l'), courseId: currentLessonCourseId, index: existing.length + 1,
        title: title, durationMinutes: duration, isPreview: isPreview, content: content,
      });
    }
    CourseData.save(data);
    lessonModalBackdrop.classList.remove('show');
    renderLessonsTable();
    renderCourses();
  });

  function deleteLesson(id) {
    if (!confirm('确定删除这个课时吗？学员在该课时上的学习进度记录也会失去关联。')) return;
    data.lessons = data.lessons.filter(function (l) { return l.id !== id; });
    var remaining = CourseData.lessonsForCourse(data, currentLessonCourseId);
    remaining.forEach(function (l, i) { l.index = i + 1; });
    CourseData.save(data);
    renderLessonsTable();
    renderCourses();
  }

  switchView('dashboard');
})();
