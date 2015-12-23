## 配置和使用GitHub

## 1、标题设置
两种设置标题的方法
* 第一种：通过在文字下方加“=”或“-”，它们表示一级标题或二级标题    


    一级标题
    =
    二级标题
    -

* 第二种：通过在文字前面加上“#”，通过“#”的数量，表示几级标题


    # 一级标题
    ## 二级标题

## 2、块注释
通过在文字开头，添加“>”表示块注释
    > 注释文字

## 3、斜体
将需要设置斜体的文字两端加上"*"或"_"，即可

    *斜体* 或 _斜体_  

## 4、粗体
将需要设置为粗体的文字使用2个"*"或"_"夹起来，即可

    **粗体** 或 __粗体__

## 5、无序列表
在文字的开头加上（*，+，_）中的一种，实现无序列表，  
注意，在（*，+，_）与文字之间要有一个空格

    * 无序列表
    + 无序列表
    _ 无序列表


## 6、有序列表
在数字之后加上“.”  

    1. 有序列表
    2. 有序列表
    3. 有序列表

## 7、链接
markdown有两种方式添加链接，分别为内联模式和引用模式   

    内联方式  
    This is an [example link](http://example.com/).   


    引用方式  
    I get 10 times more traffic from [Google][1] than from [Yahoo][2] or [MSN][3].

    [1]: http://google.com/        "Google"
    [2]: http://search.yahoo.com/  "Yahoo Search"
    [3]: http://search.msn.com/    "MSN Search"

## 8、图片  
我觉得，如果markdown是为了易读易写的话，最好还是不要图片了吧
图片的处理方式和链接的处理方式，非常的类似。

    内联方式：  
    ![alttext](https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png "Title")

    引用方式：  
    ![alt text][id]
    [id]: https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png "Title"


## 9、代码   
第一种：简单文字出现一个代码框。使用"`<blockquote>`"。（`不是单引号而是左上角的ESC下面~中的`）

    ```<blockquote>```

第二种：大片文字需要实现代码框。使用Tab和四个空格，或 "```<blockquote>```"


     ```
     <div>This is a DIV.<div>
     <div>This is a DIV.<div>
     <div>This is a DIV.<div>
    ```

## 10、
