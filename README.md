# wsp-cli 命令行工具

一个辅助工作的cli命令行工具，已发布npm包：wsp-cli 可 ```npm install wsp-cli -g``` 下载使用  

## 单词管理 （wsp word [option]）

```markdown

Options:
  -w --whole   show all word list of yours
  -l --list    show the word list which of you have not recited
  -a --add     add a word to you words list
  -c --change  change the state of word which you should recite or not
  -d --delete  delete a word from your word list
  -r --review  review your word list
  -h, --help   output usage information

Examples:
 wsp word --list
 wsp word --review
 wsp word --add test 测试
 wsp word --whole
 wsp word --delete
 wsp word --change test


```
## 模板文件生成 （wsp generate [option]）

```markdown

Options:
  -v --vue         generate a vue template file
  -s --store       generate a vuex store template file
  -e --eslint      generate a eslint template file
  -d --editconfig  generate a .editconfig template file
  -h, --help       output usage information

Examples:

 $ template --vue test.vue
 $ template --store test.store
 $ template --eslint
 $ template --editconfig


```

## todo list 管理  (wsp todo [option])


```markdown

Options:
  -l --list    show the list you should todo next time
  -a --add     add todo item of your todo list
  -d --delete  delete the todo item
  -h, --help   output usage information

Examples:

 wsp todo --list
 wsp todo --add
 wsp todo --delete

```

## sftp 上传文件到服务器目录

```markdown

Options:
  -h, --help  output usage information
Examples:
 wsp sftp

```