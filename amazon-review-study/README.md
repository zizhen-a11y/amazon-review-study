# PB-20 Review Study — 使用说明

这是可独立运行的 HTML/CSS/JavaScript 实验刺激材料，无数据库、无外部资源、无分析或跟踪脚本。

## 打开与运行

解压项目，在该目录打开终端：

```sh
python3 -m http.server 8000
```

Windows 可以使用 `py -m http.server 8000`。

- Control: http://localhost:8000/control.html
- Treatment: http://localhost:8000/treatment.html

也可以直接用浏览器打开两个 HTML 文件。所有数据通过本地脚本载入，不需要 fetch。
index.html 默认与 Control 相同，正式问卷请使用明确的两个页面地址。

## 修改商品与图片

商品资料集中在 product.js。修改 name、category、capacity、price、description、image 即可同时更新两组。
替换 assets/power-bank.svg，或将 image 改为本地 PNG/JPG 路径。不要引入影响已锁定评价属性的图片宣传。
showOverallRating 控制总体评分是否显示。showRatingDistribution 默认 false。
评分基于40条评论计算：4.675，显示4.7。概览星星使用四舍五入到整数的字符展示；数字显示精确到一位小数。

## 实验内容与共享实现

materials.json 和 materials.js 来自正式 Word。materials.js 是网页实际读取的数据，JSON 是方便研究者检查的副本。不要独立修改其中一份。当前材料保持锁定。
app.js、styles.css、product.js、materials.js 为两组共享。两个 HTML 完全相同；app.js 仅依据 treatment.html 路径决定是否插入 Summary，页面不提供切换器。网址和客户端资源天然可以被技术用户检查，纯静态网页不能提供服务器级分组访问控制。正式随机分配应由 Qualtrics 完成并仅向每位参与者发送其分组地址。
40条评论顺序固定，每页10条；翻页滚动到评论列表标题并将键盘焦点移至标题。缺失 Helpful count 时不显示、不补写。Helpful/Report 只提供当前访问的本地界面反馈，不发送、不存储、不增加锁定 Helpful count；翻页后反馈重置。
唯一分组条件是 Summary 模块整体存在与否，包括 Customers say 标题和 AI 来源说明。无属性标签或研究内部说明。

## 检查

内容逐段回构到原 Word，并按 Unicode 字符严格比较；包含 Summary、姓名、星级、标题、日期、Verified Purchase、105个正文段落、Helpful 原文与顺序。

```sh
python3 tests/verify-content.py /path/to/original.docx
node tests/verify-ui.cjs
```

第一项需要 Python 的 python-docx。第二项无第三方依赖，执行实际 app.js，使用轻量 DOM 测试环境验证四页、边界、滚动/焦点、渲染文案和两组一致性。它不能替代真实浏览器的排版及控制台检查。

## 部署与问卷整合

把 control.html、treatment.html、index.html、styles.css、app.js、product.js、materials.js、assets/ 上传至任何支持静态文件的 HTTPS 主机，保持相对路径。正式发布不需要上传 tests、材料 JSON、来源记录或 README。
Qualtrics 将被试随机分组后，链接或嵌入对应的 HTML 地址。未来记录访问、分页、滚动和停留行为可以集中接入 app.js；当前未采集这些数据。

## 本次验证限制

参考 Amazon 链接返回了页面源码，未获得可用的渲染视觉参考。采用常见 Amazon 商品/评论信息布局与独立 marketplace 字样。
两页面与所有资源通过本地 HTTP 200 检查；JavaScript 语法和运行逻辑检查通过。
当前环境没有可用浏览器执行程序，无法交付真实截图或完成桌面/手机视觉 QA、真实浏览器控制台检查。CSS 已包含手机断点，仍需研究者在正式投放前用真实设备确认排版。没有线上部署；本次交付以当前项目和本地运行方式为范围。
