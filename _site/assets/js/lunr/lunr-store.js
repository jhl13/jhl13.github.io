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
        "teaser":null},{
        "title": "softmax & SVM",
        "excerpt":"softmax &amp; SVM 因为这几天接触得比较多关于SVM和softmax的内容，所以去复习了一下。 softmax主要是重新了解了一下他的定义以及关于softmax的几种优化算法 original softmax softmax可以看成是logistic回归模型在多分类上的推广 以前学习softmax比较疑惑的一点是，他的loss function是怎么得出来的，这次复习的时候，从吴恩达机器学习关于logistic回归模型的cost函数找到了结果，softmax的损失函数是根据最大似然估计推导得到的，其实虽然说的是logistic回归模型，但是根据这个可以很容易推广导softmax的交叉熵损失函数当中。找了一篇博客，具体的推导过程在3.2节。 另外还重新看了一遍ufldl的softmax部分 对softmax的参数冗余和权重衰减有了一些新的看法。 softmax的参数冗余会造成采用牛顿法优化代价函数时遇到数值计算的问题，具体原因是Hessian矩阵不可逆，而加入权重衰减就是为了惩罚过大的参数值，使代价函数变成一个严格的凸函数，使Hessian矩阵可逆。 凸函数的定义 严格凸函数的定义:   通过相似三角形的性质可以证明这一个结论  介绍两种softmax loss的优化算法 一个是L-softmax lossLarge-Margin softmax loss 另一个是A-softmax lossangular softmax loss 还没有深入去推导过他们，但是大概知道是怎么一回事，做的事情是将映射空间（不知道这个说法合不合适）从概率转换导角度，从而使类间距离更大，类内距离更小。  A-softmax loss相比于L-softmax loss来说，多了两个条件||W1||=||W2||=1以及b=0使得类间、类内距离只取决与W和x的角度，而跟半径长度无关。 其实我觉得师兄推荐的cosface对应论文提出LMCL也是对softmax的一种优化，只是是softmax条件更苛刻，使类间更远，类内更紧凑 关于softmax的一个综述 关于SVM主要是从新看了一下各种内核的适用情况，资料是吴恩达coursera上的机器学习课程。 其中比较常用的是linear kernel以及gaussian kernel   linear kernel用在特征很多，但是训练样本较少的情况。  guassian kernel用在特征很少，训练样本适中的情况。如果特征很少，样本很多，应该先使用方法去增加特征数，然后使用线性内核的SVM或直接使用多个logistic regression回归函数。 ","categories": ["ML"],
        "tags": [],
        "url": "http://localhost:4000/ml/softmax&SVM/",
        "teaser":null},{
        "title": "深度网络结构简介",
        "excerpt":"深度网络结构 深度网络结构的发展是相互影响的，新网络结构往往会受以往的网络结构影响，而新的网络结构也往往会对旧网络结构进行针对性的改进。这里主要介绍学习内容里面说到的六种深度网络框架，虽不涉及反向传播的推导过程，但是对我们理解这些网络框架会有挺大的帮助。 AlexNet  AlexNet应该是正式拉开深度学习热潮的一个网络结构，相比于LeNet在网络深度上有了很大的提升。如上图所示，AlexNet包括了五层卷积层和三层全连接层，图中将网络整体分成两部分是因为当时的硬件计算能力并不支持这么大的网络，现在如果使用较好的GPU就不需要担心这个问题了，可以将其合并成一个部分。 AlexNet在当时比较突出的地方是：1、使用了非线性激活函数：ReLU；2、为防止过拟合使用了Dropout和数据扩充；3、使用了LRN归一化。 值得注意的是，在后面的VGGNet中指出了，LRN归一化其实并没有明显的作用。但是在Tensorflow中仍然保存有LRN归一化的API接口，这个后面可以再深入了解一下。 参考链接 VGGNet  这是VGGNet中实验过的网络结构，其中以VGG16和VGG19最为著名。VGGNet相比于AlexNet有着更深的网络结构，其次，VGGNet为了减少参数且增加模型的非线性化特性，使用了重叠的3X3卷积核去代替AlexNet中的5X5卷积核。（作者认为两个3x3的卷积堆叠获得的感受野大小，相当一个5X5的卷积；而3个3x3卷积的堆叠获取到的感受野相当于一个7x7的卷积）。池化核也从3X3变为2X2。还有一点是，VGGNet在测试阶段将全连接层化成了1X1的卷积层，使网络可以处理任意分辨率的图片。需要注意的是，现在很多应用仍使用全连接层而不是1X1的卷积层，这说明1X1的卷积层其实并不能代替全连接层，这其中的原因可以去思考一下。 参考链接 GoogLeNet GoogLeNet深度有22层，但大小却比AlexNet和VGG小很多，GoogleNet参数为500万个，AlexNet参数个数是GoogleNet的12倍，VGGNet参数又是AlexNet的3倍。究其原因是GoogLeNet对网络结构进行了大胆的尝试，将全连接改成稀疏链接，引入Inception网络结构，搭建一个稀疏性、高计算性能的网络结构。但是在实际应用上GoogLeNet在网络的最后还是加上了全连接层，比较著名的的GoogLeNet有四种V1、V2、V3、V4。为了避免梯度消失的情况，GoogLeNet采用了两个辅助分类器，以增加反向传播时的梯度。   V1的Inception网络结构加入1x1卷积核主要是为了减少通道维度，以减少参数量和计算量。 V2和V3的Inception网络结构则为了进一步减少参数，都是着重进行了卷积分解，V2将5x5卷积核替换为3x3卷积核，V3将nxn的卷积核替换为1xn和nx1的卷积核。 V4则结合了残差网络进一步加深网络结构。 参考链接 ResNet 通过实验可以发现：随着网络层级的不断增加，模型精度不断得到提升，而当网络层级增加到一定的数目以后，训练精度和测试精度迅速下降，这说明当网络变得很深以后，深度网络就变得更加难以训练了。 ResNet的由来：假设现有一个比较浅的网络（Shallow Net）已达到了饱和的准确率，这时在它后面再加上几个恒等映射层（Identity mapping，也即y=x，输出等于输入），这样就增加了网络的深度，并且起码误差不会增加，也即更深的网络不应该带来训练集上误差的上升。而这里提到的使用恒等映射直接将前一层输出传到后面的思想，便是著名深度残差网络ResNet的灵感来源。    当训练时模型精度不变甚至下降时，将学习目标从最小化loss改成学习F（x）=0，使H（x）=x，也就是变成了恒等映射的学习。这样可以在保持精度的情况下继续加深网络。需要注意的时，便捷链接可能链接到两个通道数量不一样的层，所以要使用H(x)=F(x)+Wx去调整x的维数。 疑问：学习恒等映射应该只是保持精度不变，为什么实际上会对精度有提升作用。 实验内容   基于Tensorflow对VGGNet进行finetune，重新训练后面三层全连接层参数，并在kaggle的猫狗训练集上进行实验，最后达到96.88%的正确率。发现一个比较有趣的事情，在二分类问题中如果对网络参数进行随机初始化，分类正确率基本在50%左右，应该与参数的随机初始化服从标准正态分布有关。 ","categories": ["ML"],
        "tags": [],
        "url": "http://localhost:4000/ml/%E5%B8%B8%E7%94%A8%E7%BD%91%E7%BB%9C%E7%BB%93%E6%9E%84/",
        "teaser":null}]
