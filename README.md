# ACMTrainingTeamPlatform

## 平台介绍

### 简介

ACM集训队平台。每小时更新用户在Codeforces和LeetCode平台上的提交情况，形成每日排名和个人图表分析，并且可以管理多个关注用户列表，对排名进行筛选。

### 功能页面

普通用户：登录、注册、排名、关注列表、问题、提交、用户、设置

管理员：账号管理、批量导入

### 架构

![framework](./document/img/framework.png)

### 功能

![流程图](./document/img/flow.png)

## For 开发/运维人员

### 本地调试

前端：localhost:8080

后端：localhost:5000

数据库：3306

#### 前端

frontend文件夹内

安装依赖包：`npm install`

启动服务器：`npm run serve`

打包：`npm run build`

#### 后端

backend文件夹内

与数据库连接的配置文件：[development.json](backend/config/development.json)

安装所有依赖包：`npm install`

启动服务器：`npm run serve`

打包：`npm run build`

#### 数据库

使用mysql数据库，表的创建可运行[schema.sql](./docker-compose/schema.sql)。

### 平台部署

#### 部署步骤

前置要求：安装`docker`

1. 首先克隆项目或下载zip并解压：

   `git clone https://gitee.com/wu_sheng_hao/acmtrainingteam-platform.git`

2. 然后进入`docker-compose`目录，并运行docker compose：

```shell
cd ./docker-compose
docker compose up -d
```

在`docker-compose`目录内，这一命令会下载对应的镜像并根据`docker-compose.yml`的配置执行构建，详情请查看该文件，下面简要介绍docker构建原理：

- 数据库基于[mysql:8.0.31镜像](https://hub.docker.com/_/mysql)，第一次启动时会运行[schema.sql](./docker-compose/schema.sql)中的代码。会将数据持久化储存在项目目录下的`/docker-compose/mysql`文件夹内（项目部署成功后可看到该文件夹被创建），并暴露3306端口（暴露是方便调试，上线可关闭该端口暴露）。
- 后端和定期刷新容器基于[node:16.19.0镜像](https://hub.docker.com/_/node)，并基于`backend/dist`文件夹中的[backend.js](backend/dist/backend.js)和[refresh.js](backend/dist/refresh.js)，并开启5000端口供前端请求。
- 前端基于[nginx:1.23.3](https://hub.docker.com/_/nginx)镜像，并基于`frontend/dist`文件夹进行前端部署，部署于80端口，配置文件为[nginx_container.conf](./docker-compose/nginx_container.conf)。

#### 部署检验

当`/docker-compose/mysql/data/acm_training_platform`文件夹被创建，说明数据库初始化完成。此时打开`localhost`便可以看到部署完成的平台，暴露于80端口。

注意：当使用云服务器部署时，**请开启服务器的80端口（前端）和5000端口（后端）使外部可以访问**。

#### 导入账号

首次使用时，使用管理员账号登录，账号密码均为`admin`。管理员账号拥有管理所有账号和批量导入账号的功能，批量导入采用JSON数组的格式，可以参考[import_example.json](./docker-compose/import_example.json)

#### 常见问题

Q：服务器需要走代理才能访问外网，可以让爬虫程序走代理吗？

A：可以，需要在`docker-compose`文件下添加容器的环境变量`https_proxy`，示例如下所示：

```yaml
  backend:
    container_name: backend_container
    image: node:16.19.0
    command: node /backend.js
    restart: always
    volumes: 
      - ../backend/dist/backend.js:/backend.js
    environment:
      https_proxy: http://IP地址:端口号
      NODE_ENV: production
    ports:
      - target: 5000
        published: 5000
    depends_on:
      - database
  refresh:
    container_name: refresh_container
    image: node:16.19.0
    command: node /refresh.js
    restart: always
    volumes: 
      - ../backend/dist/refresh.js:/refresh.js
    environment:
      https_proxy: http://IP地址:端口号
      NODE_ENV: production
    depends_on:
      - database
```

Q：使用`docker ps`命令看到容器的运行状态正常，但是前端网页就是无法访问，是什么原因？

A：首先，检查你的服务器的80端口是否正确地暴露；若还不能访问，则尝试将整个目录改为可执行权限：`chmod -R 777 acmtrainingteam-platform/`

Q：使用`admin`账号密码无法登录，是什么原因？

A：请检查你的服务器5000端口是否正确地暴露。