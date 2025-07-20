# 博客内容仓库

这是博客的内容仓库，包含所有文章、配置文件和静态资源。

## 目录结构

```
content-repo/
├── articles/                    # 文章内容
│   ├── 网络安全/               # 网络安全相关文章
│   ├── AI教程/                 # AI相关教程
│   ├── Windows教程/            # Windows使用教程
│   ├── 软件工具/               # 软件推荐和使用
│   ├── 自动化办公/             # 自动化办公技巧
│   └── 学习笔记/               # 各类学习笔记
├── projects/                   # 项目展示内容
├── designs/                    # 设计作品
├── videos/                     # 视频内容
├── news/                       # 新闻内容
│   ├── AI新闻/                 # AI相关新闻
│   ├── 技术新闻/               # 技术相关新闻
│   ├── 行业动态/               # 行业相关新闻
│   └── 新闻内容/               # 新闻详细内容
├── config/                     # 配置文件
│   ├── categories.yaml         # 分类配置
│   ├── tags.yaml               # 标签配置
│   ├── projects.yaml           # 项目配置
│   ├── designs.yaml            # 设计配置
│   └── videos.yaml             # 视频配置
├── assets/                     # 静态资源
│   ├── images/                 # 图片资源
│   ├── videos/                 # 视频资源
│   └── documents/              # 文档资源
└── scripts/                    # 自动化脚本
```

## 文件命名规范

### 文章文件命名
```
格式：YYYY-MM-DD-文章标题.md
示例：
- 2024-01-01-基本概念介绍.md
- 2024-03-15-Prompt工程实践指南.md
```

### Front Matter规范
```yaml
---
title: "文章标题"
date: "2024-01-01"
author: "作者名"
category: "网络安全"
subcategory: "基础入门"
tags: ["网络安全", "基础概念", "入门"]
excerpt: "文章摘要，用于列表页显示"
cover: "/assets/images/articles/网络安全/基础概念.jpg"
toc: true
draft: false
featured: false
---
```

## 内容管理

### 添加新文章
1. 在相应的分类目录下创建新的 `.md` 或 `.mdx` 文件
2. 按照命名规范命名文件
3. 添加正确的 Front Matter
4. 提交到仓库

### 更新文章
1. 直接编辑相应的 `.md` 或 `.mdx` 文件
2. 提交更改到仓库
3. 前端会自动重新构建并部署

### 管理分类和标签
- 分类配置：编辑 `config/categories.yaml`
- 标签配置：编辑 `config/tags.yaml`

## 自动化流程

当内容仓库有更新时：
1. 前端仓库会自动拉取最新内容
2. 重新生成元数据和索引
3. 重新构建网站
4. 自动部署到生产环境

## 协作规范

1. 使用 Pull Request 进行内容审核
2. 遵循文件命名和格式规范
3. 及时更新相关配置文件
4. 保持目录结构整洁

## 注意事项

- 图片等静态资源请放在 `assets/` 目录下
- 确保所有文章都有正确的 Front Matter
- 定期备份重要内容
- 遵循 Git 提交规范 