---
layout: single
title: MTCNN & FaceNet
date: 2018-10-03
category: ML
excerpt: 介绍人脸检测模型MTCNN以及人脸识别模型FaceNet
search: true
classes: wide
---

#简介
这里主要是对两篇论文的理解  
1、《Joint Face Detection and Alignment using Multi-task Cascaded Convolutional Networks》  
2、《FaceNet: A Unified Embedding for Face Recognition and Clustering》 

## MTCNN

mtcnn同时完成了人脸检测（recognition）以及人脸对齐（alignment）的任务。  

创新的地方:  
1\.  使用了三层联级结构  
2\. 考虑到face recognition和alignment的固有联系同时进行face recognition和alignment  
3\. 提供了一种名为Online Hard sample mining的训练方法，且在实际中效果不错  
  
> mtcnn分为三层，proposal net（P-Net）、refinement net（R-Net）、output net（O-Net）

<div style="text-align: center">
<img src="/images/MTCNN&FaceNet/1.png"/> 
</div>

P-Net用于生成候选窗口，R-Net用于去除错误的候选窗口，O-Net的效果与R-Net相识，但条件更加严格，用于最后输出bounding box以及facial landmarks  
在P-Net和R-Net中会用NMS（non-maximum suppression）的方式去合并高重合度的候选窗口  

NMS（non-maximum suppression）是一个迭代-遍历-消除的过程  
（1）将所有框的得分排序，选中最高分及其对应的框  
（2）遍历其余的框，如果和当前最高分框的重叠面积(IOU)大于一定阈值，我们就将框删除  
（3）从未处理的框中继续选一个得分最高的，重复上述过程。  
[参考资料](https://blog.csdn.net/shuzfan/article/details/52711706)
还没去看源代码，但是感觉应该不会只是单纯的删除候选窗口，以前有看过使用合并的。  

### 联级网络结构
<div style="text-align: center">
<img src="/images/MTCNN&FaceNet/2.png"/> 
</div>

### 网络结构
<div style="text-align: center">
<img src="/images/MTCNN&FaceNet/3.png"/> 
</div>

作者采用PRelu作为conv和fc层的激活函数，PRelu与Relu的区别在于在负半轴PRelu不饱和，对于这两个激活函数应该没有优劣的说法，但是有[论文](https://arxiv.org/pdf/1502.01852.pdf)表明使用PRelu在分类问题上会有一点提升   
### 训练过程
分成了三个部分  
> face/non-face classification  
> bounding box regression  
> facial landmark localization

face/non-face classification使用cross-entropy loss  
bounding box regression, facial landmark localization使用Euclidean loss  
文章中还提到了Multi-source training，其中要注意的是训练过程中因为使用了不同的训练图片，比如有些只是标注了是否是脸部，这种情况就只训练face/non-face   
classification而不训练bounding box regression, facial landmark localization  
Online Hard sample mining：在前向传播中使用全部样本，而反向传播只使用了其中的70%样本  

在训练过程中使用了四种不同的数据注释：  
> Negatives: IoU < 0.3  
> positives: IoU > 0.65  
> Part faces:   0.4<IoU<0.65  
> Landmark faces: landmarks五点轮廓  

这四个分类分别用来训练不同的部分，这一部分的意思还不是很懂，后面结合代码再看看。  

## FaceNet

facenet作者提供了caffe的源代码，而且github上有使用tensorflow的实现。  
facenet可以用于人脸验证face verification、人脸识别face recognition、以及聚类face clustering  

facenet 通过深度学习的方式将一幅图像映射到欧氏空间里，之后face verification就变成了评估距离的问题，face recognition就成了KNN分类问题，face clustering就相当与K-means问题  

创新的地方：  
1、减少输出维度至128维，减少了计算量  
2、使用基于LMNN的triplet-based loss function  
[LMNN](http://www.jmlr.org/papers/volume10/weinberger09a/weinberger09a.pdf)类似与SVM，但其中用knn代替了线性分类  

论文使用了两种深层卷积网络结构  
the Zeiler&Fergus model以及the Inception model of Szegedy，其中在the Zeiler&Fergus model的卷积层之间加入1x1xd的卷积层。关于1x1xd的卷积层，作者说是受这篇[文章](https://arxiv.org/pdf/1312.4400.pdf)影响，后面再看。FLPS为每秒计算浮点数的次数。  

<div style="text-align: center">
<img src="/images/MTCNN&FaceNet/4.png"/> 
</div>
<div style="text-align: center">
<img src="/images/MTCNN&FaceNet/5.png"/> 
</div>

triplets包括两个匹配的面部缩略图，一个错误匹配的面部缩略图  
triplet loss用于最小化目标与正确匹配的缩略图之间的距离，最大化与错误匹配的缩略图之间的距离  

<div style="text-align: center">
<img src="/images/MTCNN&FaceNet/6.png"/> 
</div>
<div style="text-align: center">
<img src="/images/MTCNN&FaceNet/7.png"/> 
</div>

<br/>  

由（1）可以可得，triplets需要计算argmax和argmin。  
生成triplets的方式有两种，每个step生成一次，每个mini-batch生成一次。对于文章里说到的两种方式还是有点模糊，往后再通过代码加深理解   
文章采用第二种方式，同时为了避免负样本选择不当而导致训练陷入局部最优解，将计算公式更改为  
<div style="text-align: center">
<img src="/images/MTCNN&FaceNet/8.png"/> 
</div>

### 模型结构

<div style="text-align: center">
<img src="/images/MTCNN&FaceNet/9.png"/> 
</div>  
<br/>
<b>目前不是很懂的地方：</b>face embedding代表的是什么？  

代码实现：  
使用了预训练好的模型，现在只是跑通了程序  

<div style="text-align: center">
<img src="/images/MTCNN&FaceNet/10.png"/> 
</div>  
<br/>  
用的是第一个模型  
遇到的问题，模型比较大，电脑的GPU内存（2G）比较小，要将利用率提高到90%才能正常运行。  
tensorflow版本不同，出现了一些warning，后续可能需要修改一下。  
测试LFW结果与预期结果大致一样  

<div style="text-align: center">
<img src="/images/MTCNN&FaceNet/11.png"/> 
</div> 
