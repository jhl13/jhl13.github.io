---
layout: single
title: softmax & SVM
date: 2018-10-14
category: ML
excerpt: 主要介绍softmax & SVM
search: true
classes: wide
---

# softmax & SVM

因为这几天接触得比较多关于SVM和softmax的内容，所以去复习了一下。  

softmax主要是重新了解了一下他的定义以及关于softmax的几种优化算法  

## original softmax

softmax可以看成是logistic回归模型在多分类上的推广


以前学习softmax比较疑惑的一点是，他的loss function是怎么得出来的，这次复习的时候，从吴恩达机器学习关于logistic回归模型的cost函数找到了结果，softmax的损失函数是根据最大似然估计推导得到的，其实虽然说的是logistic回归模型，但是根据这个可以很容易推广导softmax的交叉熵损失函数当中。找了一篇[博客](https://blog.csdn.net/ligang_csdn/article/details/53838743)，具体的推导过程在3.2节。  

另外还重新看了一遍[ufldl的softmax部分 ](http://ufldl.stanford.edu/wiki/index.php/Softmax%E5%9B%9E%E5%BD%92)
对softmax的参数冗余和权重衰减有了一些新的看法。  

softmax的参数冗余会造成采用牛顿法优化代价函数时遇到数值计算的问题，具体原因是Hessian矩阵不可逆，而加入权重衰减就是为了惩罚过大的参数值，使代价函数变成一个严格的凸函数，使Hessian矩阵可逆。  

[凸函数的定义](https://zh.wikipedia.org/wiki/%E5%87%B8%E5%87%BD%E6%95%B0)

严格凸函数的定义:  
<div style="text-align: center">
<img src="/images/softmax&SVM/1.png"/> 
</div>  

<div style="text-align: center">
<img src="/images/softmax&SVM/2.png"/> 
</div>  

通过相似三角形的性质可以证明这一个结论

<div style="text-align: center">
<img src="/images/softmax&SVM/3.jpg"/> 
</div>    

## 介绍两种softmax loss的优化算法

一个是L-softmax loss  
[Large-Margin softmax loss](https://blog.csdn.net/u014380165/article/details/76864572)  

另一个是A-softmax loss  
[angular softmax loss](https://blog.csdn.net/u014380165/article/details/76946380)  

还没有深入去推导过他们，但是大概知道是怎么一回事，做的事情是将映射空间（不知道这个说法合不合适）从概率转换导角度，从而使类间距离更大，类内距离更小。  

<div style="text-align: center">
<img src="/images/softmax&SVM/4.jpg"/> 
</div>   
<br/>
A-softmax loss相比于L-softmax loss来说，多了两个条件  
||W1||=||W2||=1以及b=0  
使得类间、类内距离只取决与W和x的角度，而跟半径长度无关。  

其实我觉得师兄推荐的cosface对应论文提出LMCL也是对softmax的一种优化，只是是softmax条件更苛刻，使类间更远，类内更紧凑  

关于softmax的一个[综述](https://zhuanlan.zhihu.com/p/34044634)

关于SVM主要是从新看了一下各种内核的适用情况，资料是吴恩达coursera上的机器学习课程。  

其中比较常用的是linear kernel以及gaussian kernel  

* linear kernel用在特征很多，但是训练样本较少的情况。  
* guassian kernel用在特征很少，训练样本适中的情况。

如果特征很少，样本很多，应该先使用方法去增加特征数，然后使用线性内核的SVM或直接使用多个logistic regression回归函数。  
