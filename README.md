# 庆祝兰理工毕业生—头像框微信小程序





## 效果

![image-20210803172025028](C:\Users\MSZ\AppData\Roaming\Typora\typora-user-images\image-20210803172025028.png)



![image-20210803172039603](C:\Users\MSZ\AppData\Roaming\Typora\typora-user-images\image-20210803172039603.png)

## 功能

- 选择当前头像或本地图片进行合成
- 自动支持任意数量的头像框模版
- 支持对头像原图进行缩放操作

## 使用
- 修改小程序项目信息

- 将 `index.js` 中 `const urls` 中内容改为相框图片的 url

- 将 `index.wxml` 中 `headImage` 的 `src` 改为头图的网址

- 将 `index.wxml` 中 `container` 的 `background-image` 中 url 改为长背景图的 url

- welcome同理

    

- 注意：我全部使用了微信小程序开发里的云开发存储图片，所以你运行项目的时候，肯定不会显示图片的，因此，你需要把里面所有的图片地址换成你的图片地址即可。

## 参考
[Yonghui-Lee
/
profile_photo_editor_weChatApplet](https://github.com/Yonghui-Lee/profile_photo_editor_weChatApplet)