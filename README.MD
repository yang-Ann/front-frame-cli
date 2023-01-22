# 一个简单的前端cli工具


## 安装

```sh
npm i front-frame-cli -g
```

## 使用

```sh 
# 创建项目
ff c projectName

# 查看预设方案
ff ls

# 删除预设方案
ff del presetName
```

> 如果需要额外向`package.json`中添加一些字段可以新建`~/.front-frame-cli/margePackage.json`文件, 里面的键值对会被合并到模板项目的`package.json`中
