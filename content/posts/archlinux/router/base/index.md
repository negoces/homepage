---
title: "Arch Linux 软路由: 基本路由"
date: 2022-10-27T01:16:07+08:00
slug: d6af7dd8
cover: "cover.svg"
tags: [Arch Linux Router]
categories: [Arch Linux, Network, Router]
---

打造属于自己的定制化路由器

<!--more-->

> - 网络配置全部通过 [systemd-networkd](https://systemd.network/systemd-networkd.html) 和 iproute2 实现
> - DHCP/DNS 服务器通过 [dnsmasq](https://dnsmasq.org/) 实现

## 连接 WAN 侧

先让自己获取网络

```systemd
# /etc/systemd/network/dhcp.network
[Match]
Name=e*

[Network]
DHCP=yes
```

### [选] 修改网卡名称

例子：将 MAC 为 `00:e2:69:27:da:a3` 的网卡改名为 `eth0`

```systemd
# /etc/systemd/network/00-eth0.link
[Match]
MACAddress=00:e2:69:27:da:a3

[Link]
Name=eth0
```

## 创建 LAN 侧

### 创建网桥

所有 LAN 侧端口都会接入到网桥上

```systemd
# /etc/systemd/network/br-lan.netdev
[NetDev]
Name = br-lan
Kind = bridge
MACAddress = 00:16:3e:27:da:a7

[Bridge]
STP = yes
```

### 配置网桥

设置 IP 以及启动策略

```systemd
# /etc/systemd/network/br-lan.network
[Match]
Name = br-lan

[Link]
RequiredForOnline = no
ActivationPolicy = always-up

[Network]
Address = 10.1.0.1/16
ConfigureWithoutCarrier = yes

[Bridge]
UseBPDU = yes
```

### 绑定端口至网桥

将 `eth2`、`eth3` 绑定到 `br-lan`

```systemd
# /etc/systemd/network/br-lan-bind.network
[Match]
Name = eth2
Name = eth3

[Network]
Bridge = br-lan
```

> 以上更改建议重启使其生效

## DHCP/DNS 服务

1. 安装 dnsmasq
   - `sudo pacman -Sy dnsmasq`
2. 配置 dnsmasq 服务

   ```cfg
   # /etc/dnsmasq.conf
   port=53
   server=1.2.4.8
   server=119.29.29.29
   server=223.5.5.5
   local=/lan/
   bogus-priv
   no-resolv
   all-servers
   cache-size=4096
   bind-interfaces
   
   interface=br-lan
   # IP 范围和租期
   dhcp-range=10.1.1.1,10.1.255.254,2h
   # 指定网关
   dhcp-option=option:router,10.1.0.1
   # 指定 DNS 服务器
   dhcp-option=option:dns-server,10.1.0.1
   # 指定 WINS 域名
   dhcp-option=15,lan
   # DHCP 地址池大小
   dhcp-lease-max=65535
   dhcp-leasefile=/var/lib/misc/dnsmasq.leases
   
   # SRV 记录
   srv-host=_vlmcs._tcp.lan,kms.lan,1688,0,0
   address=/kms.lan/10.1.0.1 # A 记录
   
   # MAC 绑定
   dhcp-host=00:16:3e:03:d2:5d,10.1.0.20,infinite
   ```

3. 启动 dnsmasq
   - `sudo systemctl enable --now dnsmasq`

## 启用网络转发

### 开启转发

```cfg
# /etc/sysctl.d/10-net_forward.conf
net.ipv4.ip_forward = 1
net.ipv6.conf.default.forwarding = 1
net.ipv6.conf.all.forwarding = 1
```

### [选] 开启 BBR 和 TCP fast open

```cfg
# /etc/modules-load.d/tcp_bbr.conf
tcp_bbr

# /etc/sysctl.d/10-net_bbr.conf
net.ipv4.tcp_fastopen = 3
net.core.default_qdisc = cake
net.ipv4.tcp_congestion_control = bbr
```

### [选] 修改最大连接数

```cfg
# /etc/sysctl.d/10-net_conntrack.conf
net.netfilter.nf_conntrack_max = 65535
```

### 开启 NAT 功能以及防火墙功能

如需持久化，请编辑 `/etc/nftables.conf` 并启用 `nftables.service`

```bash
# NAT
nft add rule ip nat POSTROUTING oifname "ppp*" counter masquerade
# 防火墙
nft add rule ip filter INPUT iifname "ppp*" ct state related,established  counter accept
nft add rule ip filter INPUT iifname "ppp*" ct state invalid  counter drop
nft add rule ip filter INPUT iifname "ppp*" counter drop
```
