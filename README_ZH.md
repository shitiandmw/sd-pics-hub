sd-pics-hub （圆梦照相馆）
===============


<div style="font-size: 1.5rem;">
  <a href="./README.md">English</a> |
  <a href="./README_ZH.md">中文</a>
</div>
</br>

这是一个利用stable diffusion生成个人AI写真的应用，你只需要上传一张清晰的自拍照，就可以生成多种风格的AI写真

## 目录结构

总体目录结构如下

```
├─sd-pics-hub
│  ├─api                （数据接口部分，使用Egg.js框架）
│  ├─client              客户端，暂定使用hbuild+vue构建，支持多端发布）
│  ├─doc                （文档、资料等）
│  │  ├─database.md      (数据结构)
│  ├─worker             （用于接收任务，调用stable-diffusion接口完成工作的工人模块）
│  ├─docker-compose.yml  （用于一键启动docker-compose容器编排配置文件）
│  ├─README.md          （项目说明文档）
│  ├─README_ZH.md       （项目说明文档-中文）
```
## 功能规划

**1.0 版本**

1. 通过roop处理的写真
2. 通过lora模型处理的写真
3. 通过人为干预精修处理的写真，做高级AI摄影作品

## 版权信息 

sd-pics-hub 遵循 [Apache License 2.0]() 开源协议发布，并提供免费使用。

Copyright © 2023 by EMart
