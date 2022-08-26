/**
 * web 工具库
 * 
 * @remarks
 * 提供了 web 中一些常用的工具方法，如：函数式地选择文件、下载文件 等
 * 
 * @packageDocumentation
 */


/**
 * 文件过滤器
 * @remarks
 * 与 `Array#filter()` 的回调函数一样
 * @param file - 文件
 * @param index - 文件的索引
 * @param array - 选择的所有文件
 * @returns 返回一个表示是否保留 file 的布尔值，其它类型的值会被作为布尔值来对待
 */
 export type FileFilter = (file: File, index: number, array: File[]) => any;

 /**
  * 打开文件的选项
  */
 export interface OpenFilesOptions {
   /* 
   规定通过文件上传来提交的文件的类型
   该属性的值可以是一个或多个用逗号分隔的类别声明字符串，或者是类型声明的数组
   类型声明可以是以下：
 - 以 STOP 字符 (U+002E) 开始的文件扩展名。（例如：".jpg,.png,.doc"）
 - 一个有效的 MIME 类型，但没有扩展名
 - audio/* 表示音频文件 HTML5
 - video/* 表示视频文件 HTML5
 - image/* 表示图片文件 HTML5
 */
    /**
     * 规定通过文件上传来提交的文件的类型
     * @remarks
     * 该属性的值可以是一个或多个用逗号分隔的类别声明字符串，或者是类型声明的数组
     * 
     * 类型声明可以是以下：
     * - 以 STOP 字符 (U+002E) 开始的文件扩展名。（例如：".jpg,.png,.doc"）
     * - 一个有效的 MIME 类型，但没有扩展名
     * - audio/* 表示音频文件 HTML5
     * - video/* 表示视频文件 HTML5
     * - image/* 表示图片文件 HTML5
     */
   accept?: string[] | string | null;
 
   /**
    * 是否允许选择多个文件
    */
   multiple?: boolean | null;
   /**
    * 用于捕获的媒体设备类型
    * @remarks
    * 捕获属性定义了应该使用哪种媒体（麦克风、视频或相机）来捕获新文件以在支持场景中使用文件上传控制进行上传。查看文件输入类型。
    */
   capture?: string | null;
 
   //选择目录
   directory?: boolean | null;
 
   /**
    * 文件过滤器
    */
   filter?: FileFilter[] | FileFilter | null;
 }
 
 /**
  * 打开文件
  * @param options
  * @returns 异步返回用户选择并过滤后的文件列表
  */
 export function selectFiles(options?: OpenFilesOptions | null): Promise<File[]> {
   const { directory, accept, filter, ...props } = options || {};
   const inputDom = document.createElement('input');
   const acceptStr = Array.isArray(accept) ? accept.join(',') : accept;
   if (acceptStr != null) {
     inputDom.accept = acceptStr;
   }
   inputDom.type = 'file';
   Object.assign(inputDom, props);
   inputDom.webkitdirectory = Boolean(directory);
 
   const filterFuns = Array.isArray(filter) ? filter : filter ? [filter] : [];
 
   function filterFiles(files: File[]) {
     return filterFuns.reduce(function (files, filterFun) {
       return files.filter(filterFun);
     }, files);
   }
 
   return new Promise<File[]>((resolve, reject) => {
     inputDom.onchange = function (event) {
       const files = inputDom.files as FileList;
       const finalFiles = files ? filterFiles(Array.from(files)) : [];
       resolve(finalFiles);
     };
     inputDom.click();
   });
 }
 
 /**
  * 下载文件
  * @param url - 下载链接
  * @param name - 下载后保存成的文件时的文件名字
  */
 export function downloadFile(url: string, name?: string | null) {
   const aDom = document.createElement('a');
   aDom.href = url;
   aDom.download = name ?? '';
   aDom.click();
 }
 