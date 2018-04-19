## mall后台页面

### 工具版本
**node.js 8.11.1** <br/>
**webpack 3.5.5**
### npm命令
npm init                     #引导创建一个package.json, 项目初始化。
npm install XXX -g           #全局安装<br/>
npm install xxx@version      #指定版本号
npm install xxx --save-dev   #安装到当前项目<br/>
npm install xxx --save       #安装到当前项目<br/>
npm uninstall xxx -g         #卸载全局安装<br/>
npm uninstall xxx --save-dev #卸载当前项目安装的组件<br/>
npm uninstall xxx --save     #卸载当前项目安装的组件  <br/>
npm -v                       #查看npm版本<br/>

注:<br/>
**--save-dev, --save会将安装的组件添加到package.json, --save-dev只是开发需要, --save是生产环境也需要的组件, 比如jqury。**


### 安装项目需要的环境依赖
1. 安装webpack <br/>
**npm install webpack@3.5.5 --save-dev**
2. 安装css loader <br/>
**npm install css-loader@0.28.11 --save-dev**
3. 安装style loader <br/>
**npm install style-loader@0.20.3 --save-dev**
4. 安装url loader <br/>
**npm install url-loader@1.0.1 --save-dev**
5. 安装file-loader<br/>
**npm install file-loader@1.1.11 --save-dev**
6. 安装html-loader <br/>
**npm install html-loader@0.5.5 --save-dev**
6. 安装extract-text-webpack-plugin插件 <br/>
**npm install extract-text-webpack-plugin@3.0.2 --save-dev**
7. 安装html-webpack-plugin插件  <br/>
**npm install html-webpack-plugin@3.2.0 --save-dev**
8. 安装webpack-dev-server  <br/>
**npm install webpack-dev-server@2.10.0 --save-dev**

整理:<br/>
**a. npm install webpack@3.5.5 webpack-dev-server@2.10.0 --save-dev** <br/>
**b. npm install css-loader@0.28.11 style-loader@0.20.3 --savedev** <br/> 
**c. npm install url-loader@1.0.1 file-loader@1.1.11 html-loader@0.5.5 --save-dev**  <br/>
**d. npm install extract-text-webpack-plugin@3.0.2 html-webpack-plugin@3.2.0 --save-dev** <br/>

注:<br/>
**a. css-loader, style-loader, extract-text-webpack-plugin作用于css**<br/>
**b. url-loader, file-loader作用于图片, 字体等资源**<br/>
**c. html-webpack-plugin作用于html** <br/>
**d. html-loader作用于html, 可以在目标html文件中使用<%=require('html-loader!./common/nav.html')%>语句从而导入指定的html, 对于公共的如header.html, footer.html便可以使用。**
