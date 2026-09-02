(function (global) {
  'use strict';
  var STORAGE_KEY = 'course_lite_data_v1';

  function seed() {
    return {
      wallet: { balance: 150 },
      courses: [
        { id: 'c1', title: '新媒体文案写作入门', instructor: '刘婷', price: 29, category: '运营', coverEmoji: '✍️', description: '从0开始学习新媒体文案写作，掌握标题、正文结构和爆款套路，写出真正有传播力的内容。' },
        { id: 'c2', title: 'Excel 数据分析实战', instructor: '李明', price: 79, category: '职场技能', coverEmoji: '📊', description: '用真实办公场景讲透 Excel 函数、数据透视表与图表可视化，做出让老板满意的分析报表。' },
        { id: 'c3', title: 'UI设计基础与实战', instructor: '王芳', price: 199, category: '设计', coverEmoji: '🎨', description: '从设计思维到 Figma 实操，系统学习配色、版式与组件规范，独立完成一款App界面设计。' },
        { id: 'c4', title: 'JavaScript 全栈开发进阶', instructor: '张伟', price: 299, category: '编程', coverEmoji: '💻', description: '深入 JS 异步与原型机制，掌握 Node.js 后端开发与部署上线，成为能独立开发全栈应用的工程师。' },
        { id: 'c5', title: '小红书运营增长实战', instructor: '陈静', price: 89, category: '运营', coverEmoji: '📱', description: '拆解小红书平台算法与爆款笔记方法论，从0到1打造一个持续增长的账号。' },
      ],
      lessons: [
        { id: 'c1-l1', courseId: 'c1', index: 1, title: '什么是新媒体文案', durationMinutes: 12, isPreview: true, content: '介绍新媒体文案与传统广告文案的区别，理解"边读边转化"的写作逻辑，明确本课程的学习路径。' },
        { id: 'c1-l2', courseId: 'c1', index: 2, title: '抓住用户注意力的标题公式', durationMinutes: 15, isPreview: true, content: '拆解数字型、悬念型、利益型三种高点击标题公式，附真实公众号案例对比讲解。' },
        { id: 'c1-l3', courseId: 'c1', index: 3, title: '朋友圈文案的黄金结构', durationMinutes: 18, isPreview: false, content: '讲解"痛点-场景-解决方案-行动号召"四段式结构，现场练习改写一条朋友圈文案。' },
        { id: 'c1-l4', courseId: 'c1', index: 4, title: '小红书爆款文案拆解', durationMinutes: 20, isPreview: false, content: '拆解10篇高赞小红书笔记的文案结构，总结可直接复用的表达套路。' },
        { id: 'c1-l5', courseId: 'c1', index: 5, title: '公众号推文排版与节奏', durationMinutes: 16, isPreview: false, content: '讲解段落节奏、金句提炼与排版工具的配合使用，有效提升文章读完率。' },
        { id: 'c1-l6', courseId: 'c1', index: 6, title: '建立自己的文案素材库', durationMinutes: 14, isPreview: false, content: '教你搭建一套可持续积累的选题与金句素材库，彻底告别"没灵感"。' },

        { id: 'c2-l1', courseId: 'c2', index: 1, title: 'Excel 界面与高效录入技巧', durationMinutes: 10, isPreview: true, content: '熟悉 Excel 常用界面与快捷键，掌握快速填充、批量录入等提效技巧。' },
        { id: 'c2-l2', courseId: 'c2', index: 2, title: '常用函数：VLOOKUP 与 SUMIF', durationMinutes: 22, isPreview: true, content: '通过销售台账案例，讲解 VLOOKUP 精确匹配与 SUMIF 条件求和的实际用法。' },
        { id: 'c2-l3', courseId: 'c2', index: 3, title: '数据透视表从入门到精通', durationMinutes: 25, isPreview: false, content: '用数据透视表快速汇总多维度销售数据，学会字段拖拽与计算字段设置。' },
        { id: 'c2-l4', courseId: 'c2', index: 4, title: '用图表讲好数据故事', durationMinutes: 18, isPreview: false, content: '讲解柱状图、折线图、组合图的适用场景，做出一目了然的汇报图表。' },
        { id: 'c2-l5', courseId: 'c2', index: 5, title: '条件格式与数据可视化', durationMinutes: 15, isPreview: false, content: '用条件格式给异常数据打标，配合数据条、色阶做轻量级可视化。' },
        { id: 'c2-l6', courseId: 'c2', index: 6, title: '制作一份月度经营分析报表', durationMinutes: 30, isPreview: false, content: '综合运用前面所学，从原始数据到成品报表，完成一份可直接汇报的月度分析。' },

        { id: 'c3-l1', courseId: 'c3', index: 1, title: '设计思维与用户体验基础', durationMinutes: 14, isPreview: true, content: '理解以用户为中心的设计流程：调研、原型、测试、迭代，建立设计思维框架。' },
        { id: 'c3-l2', courseId: 'c3', index: 2, title: '色彩理论与配色实战', durationMinutes: 20, isPreview: true, content: '讲解色相、饱和度、明度基础，练习为一个App设计一套主色调方案。' },
        { id: 'c3-l3', courseId: 'c3', index: 3, title: '栅格系统与版式布局', durationMinutes: 18, isPreview: false, content: '学习8点网格与栅格系统，让界面元素排列更规整、更专业。' },
        { id: 'c3-l4', courseId: 'c3', index: 4, title: '图标与插画设计入门', durationMinutes: 22, isPreview: false, content: '用矢量工具绘制一套线性图标，理解图标风格与产品调性的匹配关系。' },
        { id: 'c3-l5', courseId: 'c3', index: 5, title: 'Figma 组件与自动布局', durationMinutes: 25, isPreview: false, content: '掌握 Figma 组件、变体与自动布局，大幅提升设计稿的维护效率。' },
        { id: 'c3-l6', courseId: 'c3', index: 6, title: '移动端界面设计规范', durationMinutes: 20, isPreview: false, content: '讲解 iOS 与 Android 的设计规范差异，避免常见的适配错误。' },
        { id: 'c3-l7', courseId: 'c3', index: 7, title: '完整项目：设计一款记账App', durationMinutes: 35, isPreview: false, content: '从0到1完成一款记账App的核心页面设计，产出可直接交付的设计稿。' },

        { id: 'c4-l1', courseId: 'c4', index: 1, title: 'JS 执行机制与作用域链', durationMinutes: 20, isPreview: true, content: '讲解调用栈、执行上下文与作用域链，打好JS进阶的底层基础。' },
        { id: 'c4-l2', courseId: 'c4', index: 2, title: '异步编程：Promise 与 async/await', durationMinutes: 25, isPreview: true, content: '从回调地狱讲起，理解 Promise 状态机与 async/await 语法糖的运行本质。' },
        { id: 'c4-l3', courseId: 'c4', index: 3, title: '深入理解原型与继承', durationMinutes: 22, isPreview: false, content: '讲解原型链、构造函数与 class 语法背后真正的继承机制。' },
        { id: 'c4-l4', courseId: 'c4', index: 4, title: 'Node.js 与 Express 后端基础', durationMinutes: 30, isPreview: false, content: '搭建第一个 Express 服务，理解路由、中间件与请求响应生命周期。' },
        { id: 'c4-l5', courseId: 'c4', index: 5, title: '数据库设计与 MongoDB 实战', durationMinutes: 28, isPreview: false, content: '设计一套简单的博客数据模型，完成 MongoDB 的增删改查操作。' },
        { id: 'c4-l6', courseId: 'c4', index: 6, title: 'RESTful API 设计与鉴权', durationMinutes: 26, isPreview: false, content: '讲解 RESTful 接口设计原则，实现基于 JWT 的用户登录鉴权。' },
        { id: 'c4-l7', courseId: 'c4', index: 7, title: '前端工程化与打包优化', durationMinutes: 24, isPreview: false, content: '讲解模块打包、代码分割与构建产物体积优化的常见手段。' },
        { id: 'c4-l8', courseId: 'c4', index: 8, title: '部署上线：从代码到生产环境', durationMinutes: 20, isPreview: false, content: '讲解从服务器配置到域名解析、HTTPS 证书的完整部署流程。' },

        { id: 'c5-l1', courseId: 'c5', index: 1, title: '小红书平台算法与流量逻辑', durationMinutes: 15, isPreview: true, content: '理解小红书的推荐机制与流量池晋级逻辑，明白一篇笔记为什么会火。' },
        { id: 'c5-l2', courseId: 'c5', index: 2, title: '账号定位与人设打造', durationMinutes: 18, isPreview: false, content: '讲解如何找到差异化定位，搭建一个有记忆点的账号人设体系。' },
        { id: 'c5-l3', courseId: 'c5', index: 3, title: '爆款笔记选题与结构拆解', durationMinutes: 20, isPreview: false, content: '拆解爆款笔记的选题逻辑与内容结构，练习产出3个可执行的选题方向。' },
        { id: 'c5-l4', courseId: 'c5', index: 4, title: '封面与标题的点击率优化', durationMinutes: 16, isPreview: false, content: '讲解封面设计与标题写法对点击率的实际影响，附AB测试的基本方法。' },
        { id: 'c5-l5', courseId: 'c5', index: 5, title: '评论区互动与私域转化', durationMinutes: 14, isPreview: false, content: '讲解评论区运营技巧，以及如何把公域流量沉淀为可复用的私域用户。' },
        { id: 'c5-l6', courseId: 'c5', index: 6, title: '数据复盘与投放放大', durationMinutes: 22, isPreview: false, content: '讲解核心数据指标的复盘方法，以及信息流投放放大的基本思路。' },
      ],
      enrollments: [
        { id: 'e1', courseId: 'c2', purchasedAt: '2026-08-15T10:00:00.000Z' },
        { id: 'e2', courseId: 'c4', purchasedAt: '2026-09-01T09:00:00.000Z' },
      ],
      progress: [
        { id: 'pg1', courseId: 'c2', lessonId: 'c2-l1', completed: true, completedAt: '2026-08-16T10:00:00.000Z' },
        { id: 'pg2', courseId: 'c2', lessonId: 'c2-l2', completed: true, completedAt: '2026-08-16T11:00:00.000Z' },
        { id: 'pg3', courseId: 'c2', lessonId: 'c2-l3', completed: true, completedAt: '2026-08-17T09:00:00.000Z' },
        { id: 'pg4', courseId: 'c4', lessonId: 'c4-l1', completed: true, completedAt: '2026-09-01T12:00:00.000Z' },
        { id: 'pg5', courseId: 'c4', lessonId: 'c4-l2', completed: true, completedAt: '2026-09-01T13:00:00.000Z' },
      ],
    };
  }

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        var s = seed();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
        return s;
      }
      return JSON.parse(raw);
    } catch (e) {
      return seed();
    }
  }

  function save(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function uid(prefix) {
    return prefix + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function lessonsForCourse(data, courseId) {
    return data.lessons
      .filter(function (l) { return l.courseId === courseId; })
      .sort(function (a, b) { return a.index - b.index; });
  }

  function isEnrolled(data, courseId) {
    return data.enrollments.some(function (e) { return e.courseId === courseId; });
  }

  function courseProgress(data, courseId) {
    var lessons = lessonsForCourse(data, courseId);
    var completed = lessons.filter(function (l) {
      var pg = data.progress.find(function (p) { return p.courseId === courseId && p.lessonId === l.id; });
      return pg && pg.completed;
    }).length;
    return { completed: completed, total: lessons.length };
  }

  global.CourseData = {
    load: load,
    save: save,
    uid: uid,
    lessonsForCourse: lessonsForCourse,
    isEnrolled: isEnrolled,
    courseProgress: courseProgress,
    reset: function () { var s = seed(); save(s); return s; },
  };
})(window);
