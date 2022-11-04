---
title: "为 Git 启用 GPG 签名"
date: 2022-11-04T13:24:20+08:00
slug: e1e23afc
#cover: "cover.png"
tags: [Git, GPG]
categories: [Security]
---

<!--more-->

## 生成 GPG 密钥

**Note: 邮箱必须要使用在平台中验证过的邮箱!**

```bash
gpg --full-generate-key
# or
gpg --gen-key
```

## 启用签名

1. 使用 `gpg --list-secret-keys --keyid-format=long` 列出所有密钥
2. 记下 `sec` 的第二行密钥，在后续的步骤中将其代入 `<key_id>`
3. 告知 Git 需要使用的密钥 `git config --global user.signingkey <key_id>`
4. 使 Git 默认使用 GPG 签名 `git config --global commit.gpgsign true`

## 在平台中关联

使用 `gpg --armor --export <key_id>` 导出公钥并添加至平台

## 常见错误

### 无法为数据签名

症状:

```bash
# 报错:
error: gpg failed to sign the data
fatal: failed to write commit
# 或者
错误：gpg 无法为数据签名
致命错误：无法写提交对象
```

并且使用 `git commit -S -m "..."` 时要求输入密码并可以提交成功

原因:

VS Code 等工具无法弹出密码输入界面进行解密操作

解决方法:

删除密钥的密码保护: `gpg --change-passphrase <key_id>`，输入当前密码后再输入空密码即可删除
