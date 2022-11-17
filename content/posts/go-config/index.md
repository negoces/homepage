---
title: "Go Proxy Config"
date: 2022-11-04T14:09:48+08:00
slug: 93293139
#cover: "cover.png"
tags: [DevEnv]
categories: [Golang]
---

<!--more-->

```bash
go env -w GO111MODULE=on
go env -w GOPROXY=https://goproxy.cn,direct
go env -w GOPATH=/home/${USER}/.local/go
```
