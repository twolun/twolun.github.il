---
layout: post
title: Beginning MapReduce in Hadoop
category: database
---

Hadoop是一个开源框架，它遵循谷歌的方法实现了MapReduce算法，可以编写和运行分布式应用处理大规模数据。利用Hadoop，可以快速、廉价的建立集群。Hadoop开始是`Nutch`的一个子项目，而Nutch又是`[Apache Lucene](http://lucene.apache.org/core/)`的一个子项目。

<!--more-->

###YARN

MapReduce在hadoop-0.23版本的时候经历了一次大规模的重构，即所谓的YARN，或MRv2。重构根本的意图是将 JobTracker 两个主要的功能分离成单独的组件，这两个功能是资源管理和任务调度/监控。

新的资源管理器全局管理所有应用程序计算资源的分配，每一个应用的 ApplicationMaster 负责相应的调度和协调。一个应用程序无非是一个单独的传统的 MapReduce 任务或者是一个 DAG( 有向无环图 ) 任务。ResourceManager 和每一台机器的节点管理服务器能够管理用户在那台机器上的进程并能对计算进行组织。

事实上，每一个应用的 ApplicationMaster 是一个详细的框架库，它结合从 ResourceManager 获得的资源和 NodeManager 协同工作来运行和监控任务。更具体的原理解释，请阅读参考资料。

###HDFS
Hadoop File System，是一种分布式文件系统，专门为MapReduce这类框架下的大规模分布式数据处理而设计的。HDFS基于Google的GFS而设计[6]。

> HDFS is a filesystem designed for storing ***very large*** files with ***streaming data access*** patterns, running on clusters of ***commodity hardware***.

HDFS遵循“一次写入，多次读取”的模式。HDFS存储的数据集作为hadoop的分析对象。在数据集生成后，长时间在此数据集上进行各种分析。每次分析都将设计该数据集的大部分数据甚至全部数据，因此读取整个数据集的时间延迟比读取第一条记录的时间延迟更重要。

HDFS设计理念之一就是让它能运行在普通的硬件之上，即便硬件出现故障，也可以通过容错策略来保证数据的高可用。

####不适合HDFS的场景

1. 将HDFS用于对数据访问要求低延迟的场景：HDFS是为高吞吐量而设计的，必然导致高延迟
2. 存储大量小文件

###数据类型
为了让键/值对可以在集群上移动，MapReduce框架提供了一种序列化键/值对的方法。因此，只有哪些支持这种序列化的类菜能够在这个框架中充当键值。具体而言：

- 实现Writable接口的类可以是值
- 实现WritableComparable<T>接口的类即可以是键也可以是值（因为Key在Reduce阶段需要比较排序）
- 常用的数据类型可以参考[4]

以下数据类型可以用于键值：

- Text: This stores a UTF8 text
- ByteWritable: This stores a sequence of bytes
- VIntWritable and VLongWritable : These stores variable length integer and long values
- NullWritable: This is zero-length Writable type that can be used when you don’t want to use a key or value type

###MapReduce
MapReduce是一种数据处理模型，它最大的优点是容易扩展到多个计算节点上处理数据。其包含两个数据处理原语，即mapper和reducer。编写好MapReduce程序后，通过简单的配置就可以扩展到任意规模的集群上运行。这也正是MapReduce最吸引人的地方。

MapReduce程序通过操作键/值对来处理数据，一般的处理过程如下：

	map: (K1,V1) --> list(K2,V2)
	reduce: (k2,list(V2)) --> list(K3,V3)

map()函数以key/value对作为输入，产生另外一系列key/value对作为中间输出写入本地磁盘MapReduce框架会自动将这些中间数据按照key值进行聚集，且key值相同（用户可设定聚集策略，默认情况下是对key值进行哈希取模）的数据被统一交给reduce()函数处理。

reduce()函数以key及对应的value列表作为输入，经合并key相同的value值后，产生另外一系列key/value对作为最终输出写入HDFS。


###Example
下面解释Hadoop官方的单词计数的例子，核心代码都加上了注释：

对于Mapper，输入的key为字符串的偏移量，value为文本中的一行。通过分词，将每个单词作为输出的key，1作为输出的value。

	/**
	 * <KEYIN, VALUEIN, KEYOUT, VALUEOUT>
	 */
	public static class MyMapper extends Mapper<Object, Text, Text, IntWritable>{
		
		private final static IntWritable one = new IntWritable(1);
		private Text word = new Text();
		
		public void map(Object key, Text value, Context context) throws IOException, InterruptedException{
			//use StringTokenizer to split a line to a serial of words
			StringTokenizer itr = new StringTokenizer(value.toString());
			while(itr.hasMoreTokens()){
				word.set(itr.nextToken());
				//the result of map: <word, 1>
				context.write(word, one);
			}
		}
	}

下面是Reducer：Reduce的输入就是Map的输出，所以输入的Key就是一个个的单词，输入的value都为1。Reduce阶段只要将key相同的都加起来就可以了。

	/**
	 * <KEYIN, VALUEIN, KEYOUT, VALUEOUT>
	 * The input of Reducer is the output of Mapper
	 */
	public static class MyReducer extends Reducer<Text, IntWritable, Text, IntWritable>{
		
		private IntWritable result = new IntWritable();
		public void reduce(Text key, Iterable<IntWritable> values, Context context) throws IOException, InterruptedException{
			int sum = 0;
			for (IntWritable val : values) {
				System.out.println(key.toString()+" ---> "+val.get());
				sum += val.get();
				System.out.println("Temp sum = "+sum);
			}
			result.set(sum);
			context.write(key, result);
		}
	}

最后编写主函数如下：

	public static void main(String[] args) throws Exception {
		//Initialization
		Configuration conf = new Configuration();
		
		if(args.length != 2){
			System.err.println("Usage: wordcount <input> <output>");
			System.exit(2);
		}
		
		Job job = Job.getInstance(conf,"word count");
		job.setJarByClass(WordCount.class);
		
		//map --> combine --> reduce
		job.setMapperClass(MyMapper.class);
		job.setCombinerClass(MyReducer.class);
		job.setReducerClass(MyReducer.class);
		
		//set the type of result <key, value> == <word, count>
		job.setOutputKeyClass(Text.class);
		job.setOutputValueClass(IntWritable.class);
		
		FileInputFormat.addInputPath(job, new Path(args[0]));
		FileOutputFormat.setOutputPath(job, new Path(args[1]));
		
		System.exit(job.waitForCompletion(true) ? 0:1);
	}

总结如下，用户编写完MapReduce程序后，按照一定的规则指定程序的输入和输出目录，并提交到Hadoop集群中。Hadoop将输入数据切分成若干个输入分片（input split，后面简称split），并将每个split交给一个Map Task处理；Map Task不断地从对应的split中解析出一个个key/value，并调用map()函数处理，处理完之后根据Reduce Task个数将结果分成若干个分片（partition）写到本地磁盘；同时，每个Reduce Task从每个Map Task上读取属于自己的那个partition，然后使用基于排序的方法将key相同的数据聚集在一起，调用reduce()函数处理，并将结果输出到文件中。

![MapReduce](/img/posts/141020-mr.PNG)

###MapReduce的应用场景

MapReduce能够解决的问题有一个共同特点：任务可以被分解为多个子问题，且这些***子问题相对独立，彼此之间不会有牵制***，待并行处理完这些子问题后，任务便被解决。在实际应用中，这类问题非常庞大，谷歌在论文中提到了MapReduce的一些典型应用，包括分布式grep、URL访问频率统计、Web连接图反转、倒排索引构建、分布式排序等，这些均是比较简单的应用。下面介绍一些比较复杂的应用。

###References

1. http://www.ibm.com/developerworks/cn/opensource/os-cn-hadoop-yarn/
2. http://www.csdn.net/article/2013-12-18/2817842-bd-hadoopyarn
3. http://hadoop.apache.org/docs/current/hadoop-yarn/hadoop-yarn-site/YARN.html
4. http://www.datascience-labs.com/mapreduce/hadoop-data-types/
5. http://os.51cto.com/art/201212/369564.htm
6. http://www.datascience-labs.com/hadoop/hdfs/