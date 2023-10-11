const { app, mock, assert } = require("egg-mock/bootstrap");
const path = require("path");
const fs = require("fs");

describe("test/app/service/doppelganger.test.js", () => {
  let ctx;

  before(async () => {
    ctx = app.mockContext();
  });

  it("downloadimg()", async () => {
    let url =
      "/r/template/XZ_00003/compress/832e3a17-36ed-4d6c-b0dd-d6c796c4104e.png";

    // 系统文件分割符
    let __ = path.sep;
    let day = ctx.ltool.formatTime2(new Date().valueOf(), "YYYYMMDD");
    // 定义下载路径
    let download_path = app.baseDir + `${__}tmp${__}download`;
    // 删除临时压缩目录下所有不是以 day 命名的文件夹 , 节省空间
    await ctx.ltool.deleteDir(download_path, day);
    download_path += `${__}${day}`;
    // 若不存在，则创建此目录
    if (!fs.existsSync(download_path))
      fs.mkdirSync(download_path, { recursive: true });

    // 下载图片到指定的目录
    let downloadFileName = await ctx.ltool.downloadImg(
      app.config.tencent.cos.host + url,
      download_path
    );

    console.log("downloadFileName", downloadFileName);

    assert(true);
  });
});
