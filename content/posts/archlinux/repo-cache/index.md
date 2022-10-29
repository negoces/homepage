---
title: "搭建 Arch Linux 仓库缓存"
date: 2022-10-29T16:50:27+08:00
slug: 51077ee2
#cover: "cover.png"
tags: [Arch Linux, Cache, Nginx]
categories: [Arch Linux]
---

当局域网中有多台 Arch Linux 计算机需要更新时，搭建缓存会节约大量的时间和流量，虽然搭建完整镜像也可以解决，但是全量同步过于耗费存储和流量

<!--more-->

## 安装 Nginx

```bash
sudo pacman -Sy nginx
```

## 创建相关文件夹

此处将缓存放置到：`/data/nginx`

```bash
mkdir -p /data/nginx
```

## 配置 Nginx

规则特点：

- Line 4: 缓存将保存到 `/data/nginx/cache` 
- Line 5: 缓存将以 `/x/xx/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` 的路径形式保存
- Line 7: 缓存池大小 `16G`
- Line 8: 资源有效期 8 天
- Line 13: 缓存 `archlinux` 和 `archlinxucn` 源的所有 `.pkg.tar.zst` 格式的文件
- Line 16 & 20: 上游镜像为 `北京外国语大学`

```nginx
# /etc/nginx/nginx.conf
http {
    ...
    proxy_cache_path
        /data/nginx/cache
        levels=1:2
        keys_zone=arch_cache:8m
        max_size=16g 
        inactive=7d
        use_temp_path=off;

    server {
        ...
	location ~ ^/archlinux(|cn)/.*pkg.tar.zst {
            proxy_cache arch_cache;
            proxy_cache_valid any 3d;
            proxy_pass https://mirrors.bfsu.edu.cn;
        }

	location / {
	    proxy_pass https://mirrors.bfsu.edu.cn;
	}
    }
}
```

## 启动 Nginx 与配置客户机

1. 测试配置文件有效性: `sudo nginx -t`
2. 启动 Nginx: `sudo systemctl enable --now nginx`
3. 在客户机的 `/etc/pacman.d/mirrorlist` 中加入缓存主机(放在第一条，第二条可以写入其他镜像作为后备)
   - `Server = http://<IP>/archlinux/$repo/os/$arch`

