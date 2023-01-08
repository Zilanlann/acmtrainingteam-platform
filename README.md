# ACMTrainingTeamPlatform

#### 介绍
ACM集训队平台

#### 部署方法

前置要求：安装`docker`

1. 首先克隆项目或下载zip并解压：

   `git clone https://gitee.com/wu_sheng_hao/acmtrainingteam-platform.git`

2. 然后进入`docker-compose`目录，并运行docker compose：

```shell
cd ./docker-compose
docker compose up -d
```

在`docker-compose`目录内，这一命令会根据`docker-compose.yml`的配置执行构建，想要了解如何构建的可以查看该文件。

执行完毕后，等待一会后，打开`localhost`便可以看到部署完成的平台。暴露于localhost的80端口。