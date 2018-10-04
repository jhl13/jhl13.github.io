var store = [{
        "title": "简介-CTC",
        "excerpt":"CTC CTC (Connectionist Temporal Classification) 是针对时间分类任务所设计出来的，利用它可以实现端到端的文本识别，在一定程度上解决了文本识别中的分割问题。 通过上面的图片可以对CTC的工作有一个比较直观的理解。它不需要输入输出在每一个时刻都对齐，只要求最后的输出跟目标输出一致。 CTC与别的算法主要区别在于，他要求输出序列不短于目标序列，且引入了Blank状态。 如： CTC主要在做的东西是预测每一个时刻的输出，然后合并相邻的重复输出，再移去blank状态。 这里，两个L之间blank状态有着很关键的作用，它可以分隔开来两个相同的输出，避免了得到helo的结果。 从上图可以看出，CTC对输出序列有两个要求，第一个是输入序列要不短于label长度;第二个是为了能区分开两个相同字母相邻的情况，需要对label做一下处理，通常的操作是在label中每个元素的前后加上blank状态，这样做会使label长度由U变成2U+1。 如: LOSS function 计算前向通道的时候，我们可以采用合并相同路线的方式去简化计算，也就是说每一个节点的概率只计算一次，这样可以减少很多计算量。这类似于HMM的forward-backword Algorithm。 计算前向通道的时候有一个值得注意的地方，那就是节点链接的合理性比如说label集合是[ε1 a ε2 p ε3 p ε4 l ε5 e ε6],ε是blank，为了方便区分加了下 标，假设一个输出序列是正确的话如果t时刻预测结果是e，则t-1的预测则一定是[l ε5 e]之间的一个;如果 t时刻预测结果是ε6，则t-1的预测则一定是[e ε6]之间的一个;如果 t时刻预测结果是p，则t-1的预测则一定是[ε3 p]之间的一个;且一条正确的路径只能由[ε1 a]开始，以[e ε6]结束。 所以前后节点的链接方式如下 下图是一个有效路径的示意图 所以前后向算法在 前向推导：(1)初始化: (2)递推关系： 因为时间关系，有些路径不能到达终点 U‘-u-1 &gt; 2(T-t) 同理后向推导：(1)初始化: (2)递推关系： CTC loss...","categories": ["ML"],
        "tags": [],
        "url": "http://localhost:4000/ml/%E7%AE%80%E4%BB%8B-CTC/",
        "teaser":null},{
        "title": "简介-RNN",
        "excerpt":"vanilla RNN RNN最大的特点在于同一隐藏层的各单元按照序列链接。  通过这个图可以知道，RNN比CNN更适合处理具有一定序列的输入，因为RNN的结构决定了前面的输入必然能影响到后面的输出。这使得RNN在NLP这一领域获得了很大的成功。 在学习RNN的过程过程中反向传播公式的推导应该是比较难的一个部分，因为像是CNN的反向传播只有一个方向，就是上一层传递给下一层，而RNN除了沿上下层的传播还有沿时间序列方向的传播。 最终推导结果：c为隐藏层到输出的bias，b为输入到隐藏层的bais，推导过程比较长，以下这篇文章写得比较清晰循环神经网络以及deeplearningbook写得比较清晰  在编程过程中发现了一个比较容易出错的地方，那就是反向传播过程要注意残差在上下层之间传递，因为参考内容的推导过程主要是以一个隐藏层作为例子，所以写代码的过程要注意这一点，如下图，残差3要往4和5的方向传递，但要注意的是，残差3是有1,2两个方向的残差累加而成的。  另一个需要注意的地方是，在某些任务（不是全部）中RNN的训练和测试是很不一样的，这里举的例子是cs231n的image captioning 问题。 训练时因为知道正确的label，所以可以将ground-truth直接当成input输入到RNN当中，但是训练的时候，因为不知道ground-truth，所以要将前一个输出要当成后一个的输入。拿上面的图为例就是用x(t – 1)预测出o(t-1),然后将o(t-1)当成x(t)再次输入到网络。 采用这种方式是因为cs231n的assignment3将图像的特征当成input输入到网络时只会预测出结果中的第一个词。采用的结构感觉是在one to many上做了一些变动。  Vanilla RNN的缺点 训练过程中容易发生梯度爆炸或梯度消失，产生的原因在参考资料循环神经网络中有详细说明。 梯度爆炸可以简单用阈值方式解决。而解决梯度消失也有挺多的方式，参考资料循环神经网络中提到了三种常见的方式，我觉得进行batch normalization也应该可以缓解这种现象。  LSTM 如sigmoid函数，如果输入的模过大就会出现梯度消失的情况，LSTM为了解决这一问题加入了门和单元状态的概念，可以有效的控制前面输入对后面输出的影响。  LSTM添加了三个门，遗忘门（forget gate）用以决定上一时刻的单元状态有多少能保留下来，输入门（input gate）用来决定输入状态有多少能进入到单元状态，输出门（output gate）用来决定单元状态有多少能输出到output  c为单元状态（相当于一个容器），从左往右的三个X分别为遗忘门，输入门和输出门。反向传播公式的推导在参考资料deeplearningbook和LSTM中有很详细的过程             状态单元c并不直接输出，在反向传播计算残差的时候要格外注意这一点。 LSTM还有很多不同的变体，比如说GRU，GRU网上资料说是LSTM最为成功的一种变体，在后面的学习中会详细的去了解。 一些想法RNN比较适合处理时序问题，之前还看过一篇博客，内容主要是在介绍RNN能做一些什么事情，里面比较有趣的是让电脑学会从左往右去看一张图片。  OCR 对于text recognition有两种比较常见的方法非端到端的OCR：需要进行预分割，特征提取，语义分析等环节，各环节之间存在一定关系端到端OCR：无需进行预分割，且整个过程是一个整体 ","categories": ["ML"],
        "tags": [],
        "url": "http://localhost:4000/ml/%E7%AE%80%E4%BB%8B-RNN/",
        "teaser":null},{
        "title": "简介-模板与重载",
        "excerpt":"C++模板函数与重载函数 模板函数 可以理解为一段通用代码形参类型由编译器决定下述类型要相同，不同编译器会报错 template&lt;class T&gt;T function(T a, T b, T c){ return a + b * c;}更通用的版本 template&lt;class Ta, class Tb, class Tc&gt;Ta function(Ta a, Tb b, Tc c){ return a + b * c;}重载函数 定义多个同名函数的机制称为函数重载 void function(int a, int b){ a = b;}void function(int a, int b, int c){...","categories": ["C++ language"],
        "tags": [],
        "url": "http://localhost:4000/c++%20language/%E6%A8%A1%E6%9D%BF%E4%B8%8E%E9%87%8D%E8%BD%BD/",
        "teaser":null},{
        "title": "递归全排列",
        "excerpt":"递归全排列 先看代码 void Perm(int list[], int k, int m) { if (k == m) { for (int i = 0; i &lt;= m; i++) System.out.print(list[i]); System.out.println(); } else { for (int i = k; i &lt;= m; i++) { // 从固定的数后第一个依次交换 Swap(list, k, i); Perm(list, k + 1, m); //...","categories": ["C++ language"],
        "tags": [],
        "url": "http://localhost:4000/c++%20language/%E9%80%92%E5%BD%92%E5%85%A8%E6%8E%92%E5%88%97/",
        "teaser":null},{
        "title": "MTCNN & FaceNet",
        "excerpt":"#简介这里主要是对两篇论文的理解1、《Joint Face Detection and Alignment using Multi-task Cascaded Convolutional Networks》2、《FaceNet: A Unified Embedding for Face Recognition and Clustering》 MTCNN mtcnn同时完成了人脸检测（recognition）以及人脸对齐（alignment）的任务。 创新的地方:1. 使用了三层联级结构2. 考虑到face recognition和alignment的固有联系同时进行face recognition和alignment3. 提供了一种名为Online Hard sample mining的训练方法，且在实际中效果不错 mtcnn分为三层，proposal net（P-Net）、refinement net（R-Net）、output net（O-Net） P-Net用于生成候选窗口，R-Net用于去除错误的候选窗口，O-Net的效果与R-Net相识，但条件更加严格，用于最后输出bounding box以及facial landmarks在P-Net和R-Net中会用NMS（non-maximum suppression）的方式去合并高重合度的候选窗口 NMS（non-maximum suppression）是一个迭代-遍历-消除的过程（1）将所有框的得分排序，选中最高分及其对应的框（2）遍历其余的框，如果和当前最高分框的重叠面积(IOU)大于一定阈值，我们就将框删除（3）从未处理的框中继续选一个得分最高的，重复上述过程。参考资料还没去看源代码，但是感觉应该不会只是单纯的删除候选窗口，以前有看过使用合并的。 联级网络结构 网络结构 作者采用PRelu作为conv和fc层的激活函数，PRelu与Relu的区别在于在负半轴PRelu不饱和，对于这两个激活函数应该没有优劣的说法，但是有论文表明使用PRelu在分类问题上会有一点提升 训练过程 分成了三个部分 face/non-face classificationbounding box regressionfacial landmark localization...","categories": ["ML"],
        "tags": [],
        "url": "http://localhost:4000/ml/MTCNN&FaceNet/",
        "teaser":null}]
