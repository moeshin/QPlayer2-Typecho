# QPlayer2 for Typecho

一款简洁小巧的 HTML5 底部悬浮音乐播放器

### 安装

1. [下载](https://github.com/moeshin/QPlayer2-Typecho/releases/latest) 此工程
2. 解压，并将文件夹重命名为 `QPlayer2`
3. 将文件夹放到 Typecho 的插件目录，默认 `usr/plugins`
4. 在控制台启用插件

### 歌曲列表

JSON 数组

| 键名      | 说明                | 必须                  |
| ----     | ----               | ----                  |
| name     | 歌曲名称             | 是                    |
| artist   | 艺术家数组或文本      | 否                    |
| cover    | 封面链接             | 否                    |
| lyrics   | [歌词文本][0]        | 否                    |
| provider | 提供器名称           | 否，默认 [`default`][1] |
| lrc      | 歌词链接，随提供器而定 | 否                     |

```json
[{
    "name": "Nightglow",
    "artist": "蔡健雅",
    "audio": "https://cdn.jsdelivr.net/gh/moeshin/QPlayer-res/Nightglow.mp3",
    "cover": "https://cdn.jsdelivr.net/gh/moeshin/QPlayer-res/Nightglow.jpg",
    "lrc": "https://cdn.jsdelivr.net/gh/moeshin/QPlayer-res/Nightglow.lrc"
    }, {
    "name": "やわらかな光",
    "artist": "やまだ豊",
    "audio": "https://cdn.jsdelivr.net/gh/moeshin/QPlayer-res/やわらかな光.mp3",
    "cover": "https://cdn.jsdelivr.net/gh/moeshin/QPlayer-res/やわらかな光.jpg",
    "lyrics": "[00:00.00]请欣赏"
}]
```


[0]: https://zh.wikipedia.org/zh-hans/LRC%E6%A0%BC%E5%BC%8F
[1]: https://github.com/moeshin/QPlayer2#qplayerproviderdefault
