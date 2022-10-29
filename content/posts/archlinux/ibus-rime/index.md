---
title: "Arch Linux 安装 ibus-rime 输入法"
date: 2022-10-29T16:58:59+08:00
slug: ac4a5a0c
#cover: "cover.png"
tags: [Arch Linux, Input Method, Ibus, Rime]
categories: [Arch Linux]
---

为您的 Arch Linux 安装中文输入法

<!--more-->

## 安装  ibus-rime

一条指令即可：

```bash
sudo pacman -Sy ibus-rime
```

## 启用输入法

在 Gnome 桌面上很简单：

1. 注销后重新登录
2. 打开设置，找到 `键盘`
3. 在 `输入法` 中点击 `+` 号
4. 选择 `汉语` -> `中文(Rime)`

## 配置

打开配置文件夹：`~/.config/ibus/rime`，每次修改完成后需要点击 `重新部署`

### 设置候选词数量及默认输入法

```yaml
# default.custom.yaml
patch:
  "menu/page_size": 7
  schema_list:
    - schema: luna_pinyin
```

### 候选框横向显示

```yaml
# ibus_rime.custom.yaml
patch:
  "style/horizontal": true
```

### 设置默认英文输入和简体

```yaml
# luna_pinyin.custom.yaml
patch:
  "switches/@0/reset": 1 # 若要默认输入英文则设置为 0
  "switches/@2/reset": 1 # 若要默认输入繁体则设置为 0
```

提示：

- `Shift` 键切换中英文
- `Control` + `Shift` + `4` 键切换繁简输入
- `/xl` 可输入希腊字母
- `/xld` 可输入大写希腊字母
- `/xl` 可输入天干
- `/dz` 可输入地支

