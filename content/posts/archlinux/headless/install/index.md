---
title: "Arch Linux Headless 安装指北"
date: 2022-10-25T13:49:03+08:00
slug: 346b09eb
cover: "cover.svg"
tags: [Arch Linux, Headless, Install Guide]
categories: [Arch Linux Headless]
---

不靠谱的 [Arch Linux](https://wiki.archlinux.org/title/Arch_Linux_(%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87)) 安装指南：为 Headless 设备安装 Arch Linux

<!--more-->

> Headless 设备无显示/输入设备，需要在其他设备上安装/控制，本指南安装将不包括 Grub 安装，且将使用 EFISTUB 和 Unified Kernel Image 进行引导。

## 进入 Live CD 或已有系统

- 如果目标设备没有 `IPMI` (智能平台管理接口) 也无法连接显示设备，可将硬盘安装到已有计算机进行安装 (安装步骤有些许不同, 文中会标注)
- 如果目标设备有显示和输出设备，也可使用 Live CD 启动后安装
- 已有计算机须安装 `extra/arch-install-scripts`
- **好消息！新版 Live CD 默认开启 SSH，可以远程复制粘贴指令进行安装啦！**

### 连接网络

> Arch Linux 的安装**必须有网络连接**，整个系统的安装将从镜像站下载软件包。这也意味着安装的系统一定为当前最新版本。

1. 首先，使用 `ip addr` 检查是否当前是否分配到 IP。
   - 若使用的是无线，请先使用 `iwctl station wlan0 connect <SSID>` 连接到无线网络
2. 使用 `ping -c 3 223.5.5.5` 检查是否正常联网。
3. 使用 `ping -c 3 aliyun.com` 检查 DNS 是否正常。
   - 若失败可在 `/etc/resolv.conf` 文件开头添加 `nameserver 223.5.5.5` 使用阿里 DNS

### 设置镜像源

```bash
echo 'Server = https://mirrors.bfsu.edu.cn/archlinux/$repo/os/$arch' | tee /etc/pacman.d/mirrorlist
```

### 进行分区并挂载

**[!!!数据无价，谨慎操作!!!]** 使用 `fdisk` 或 `cfdisk` 对磁盘进行分区 [菜鸟 fdisk 教程](https://www.runoob.com/linux/linux-comm-fdisk.html)

- 使用 `fdisk -l` 或 `lsblk` 可以看到当前所有硬盘分区和设备号 **(以下分区号均为示例，请根据自身情况调整)**
- 使用 `fdisk /dev/sda` 可对 `sda` 进行分区，NVMe 磁盘一般为 `/dev/nvme0n1`
- 添加以下分区 **(以 UEFI 和 GPT 为例)**
  - 分区序号 1，引导分区，**可与其他系统共用，确保为第一分区**，分区格式 vfat，因为使用 EFISTUB，**确保分区大小至少 64M**
  - 分区序号 2，系统分区，分区格式 `ext4` 或 `xfs` 或 `btrfs`，大小 10G+
  - 分区序号 3，交换分区，**可选，可作为文件放入系统分区**，分区类型 swap，大小一般为内存的一半，若要使用休眠功能，大小至少大于等于内存
- 格式化分区
  - 引导分区：`mkfs.vfat /dev/sda1`，**若与其他系统共用请不要格式化**
  - 系统分区：`mkfs.xfs /dev/sda2`，ext4/btrfs 格式化指令分别为 `mkfs.ext4` 和 `mkfs.btrfs`
  - 交换分区：`mkswap /dev/sda3`
- 挂载分区
  - 系统分区：`mount /dev/sda2 /mnt`
  - 引导分区：`mkdir -p /mnt/efi && mount /dev/sda1 /mnt/efi`
  - 交换分区：`swapon /dev/sda2`

### 安装 Arch Linux

使用 `pacstrap` 将 ArchLinux 安装到 `/mnt`

```bash
pacstrap /mnt <packages_name>
# eg:
pacstrap /mnt linux linux-firmware base
```

- 按需将以下包名替换到 `<packages_name>` 内(空格分隔)：
  - `linux`：linux 内核，**必选**，可替代项 `linux-lts`、`linux-zen`、`linux-hardened`，区别可在 [这里](https://wiki.archlinux.org/title/Kernel_(%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87)#%E5%AE%98%E6%96%B9%E6%94%AF%E6%8C%81%E7%9A%84%E5%86%85%E6%A0%B8) 找到
  - `base`：基本系统组件，**必选**
  - `linux-firmware`：一些设备所需的驱动/固件
  - `intel-ucode`：Intel CPU 微代码补丁，AMD CPU 替代项：`amd-ucode`
  - `networkmanager`：网络管理器，不建议，headless 使用 `systemd-networkd` 就够了
  - `vim`：文本编辑器，可替代项 `nano`
  - `sudo`：使普通用户有管理员权限执行指令，可替代项 `opendoas`
  - `efibootmgr`：修改 UEFI 启动项的工具

### 生成 fstab

内核加载后会读取 `/etc/fstab` 对分区进行挂载，缺少此文件可能会导致系统启动失败

```bash
genfstab -U /mnt >> /mnt/etc/fstab
```

## 配置新系统

使用 `arch-chroot /mnt` 进入新系统进行配置

### 设置主机名

```bash
# 将 <hostname> 替换为主机名
export HOST_NAME="<hostname>"
echo "$HOST_NAME" | tee /etc/hostname
echo "127.0.0.1   localhost
::1         localhost
127.0.0.1   $HOST_NAME" | tee /etc/hosts
```

### 设置时区

```bash
# 修改时区为：亚洲/上海
ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
```

### 设置语言

1. 修改 `/etc/locale.gen`，(实在眼疼找不到的话就直接在文件首行添加吧)

   ```diff
   - #en_US.UTF-8 UTF-8
   - #zh_CN.UTF-8 UTF-8
   + en_US.UTF-8 UTF-8
   + zh_CN.UTF-8 UTF-8
   ```

2. 执行 `locale-gen` 生成语言文件
3. 设置语言(二选一)

   ```bash
   # 设置显示语言为中文
   echo 'LANG="zh_CN.UTF-8"' | tee /etc/locale.conf
   # 设置显示语言为英文
   echo 'LANG="en_US.UTF-8"' | tee /etc/locale.conf
   ```

### 创建用户

1. 配置 sudo，编辑 `/etc/sudoers`

   ```diff
   @ 正常提权(需要输入密码确认)
   - # %wheel ALL=(ALL) ALL
   + %wheel ALL=(ALL) ALL
   + Defaults env_reset,pwfeedback
   @ 免密码提权(和上面 二选一)
   - # %wheel ALL=(ALL:ALL) NOPASSWD: ALL
   + %wheel ALL=(ALL:ALL) NOPASSWD: ALL
   ```

2. 创建账户并设置密码

   ```bash
   # 将 <username> 替换为用户名
   export USER_NAME="<username>"
   useradd -m -U -G wheel $HOST_NAME
   passwd $HOST_NAME
   # 输入密码，回车，确认密码，回车
   ```

### 生成内核

1. 编辑 `/etc/mkinitcpio.d/linux{-zen,-lts}.preset`，`{}` 表示可选项，根据内核自行选择，以 zen 为例

   ```diff
   # mkinitcpio preset file for the 'linux-zen' package
   
   ALL_config="/etc/mkinitcpio.conf"
   ALL_kver="/boot/vmlinuz-linux-zen"
   + ALL_microcode=(/boot/*-ucode.img)
   
   @ 取消生成 fallback 以减少空间占用
   - PRESETS=('default' 'fallback')
   + PRESETS=('default')
   
   #default_config="/etc/mkinitcpio.conf"
   default_image="/boot/initramfs-linux-zen.img"
   @ 需要用 efibootmgr 添加其他项，不会就用下一条
   + default_efi_image="/efi/EFI/Linux/linux-zen.efi"
   @ 如果目标计算机和当前执行指令的计算机不是一台，用这个
   + default_efi_image="/efi/EFI/boot/bootx64.efi"
   #default_options=""
   
   #fallback_config="/etc/mkinitcpio.conf"
   fallback_image="/boot/initramfs-linux-zen-fallback.img"
   fallback_options="-S autodetect"
   ```

2. 编辑 `/etc/kernel/cmdline`，`<UUID>` 使用系统分区的 UUID 替换，使用 `blkid` 查看

   ```bash
   root=UUID=<UUID> rw loglevel=3
   # eg
   root=UUID=2223f3ec-b8f6-4e19-bb63-fcfed646c110 rw loglevel=3
   ```

3. 创建文件夹：`mkdir -p /efi/EFI/boot`
4. 生成内核：`mkinitcpio -P`

### 启用 DHCP

```bash
echo "[Match]
Name=e*

[Network]
DHCP=yes" | tee /etc/systemd/network/dhcp.network
systemctl enable systemd-networkd
systemctl enable systemd-resolved
```

### 安装并启用 SSH

```bash
pacman -Sy openssh
systemctl enable sshd
```

### [选] 添加 ArchlinuxCN 软件源

1. 添加配置

   ```bash
   echo '[archlinuxcn]
   Server = https://mirrors.bfsu.edu.cn/archlinuxcn/$arch' | \
   tee -a /etc/pacman.conf
   ```

2. 安装密钥环

   ```bash
   sudo pacman -Sy && sudo pacman -S archlinuxcn-keyring
   ```

### 重启进入系统

1. 使用 `exit` 退出当前系统
2. 使用 `reboot` 重启系统
