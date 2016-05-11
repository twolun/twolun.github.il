---
layout: post
title: REST API使用指南
category: knowledge
---

我们了解了什么是REST, 并且知道大部分的网络服务都提供了REST API，国内的诸如微博、土豆等，国外的诸如google, twitter等。但是我们如何来具体的使用REST API呢，本文将介绍如何使用Java语言使用第三方REST API。
<!--more-->
###1. 基于Streaming的方式
这种方法比较传统，也是最为直观的开发方式，利用HttpURLConnection建立指向特定URL的连接请求，从而获取JSON字符串。Java API对HttpURLConnection的解释是：
> 每个HttpURLConnection实例都可用于生成单个请求，但是其他实例可以透明地共享连接到HTTP服务器的基础网络。请求后在 HttpURLConnection 的 InputStream 或 OutputStream 上调用 close() 方法可以释放与此实例关联的网络资源，但对共享的持久连接没有任何影响。如果在调用 disconnect() 时持久连接空闲，则可能关闭基础套接字。

因此，我们可以使用如下的方法建立指向特定URL的HTTP连接：

	URL url = new URL("YOUR URL INSERT HERE");
    HttpURLConnection conn = (HttpURLConnection) url.openConnection();
    conn.setRequestMethod("GET");
    conn.setRequestProperty("Accept", "application/json");
    br = new BufferedReader(new InputStreamReader(conn.getInputStream()));


通过以上方法我们可以获得指向该URL的流对象。通过读取该流，我们自然可以获得该URL指向的web资源，即json字符串。流的读取非常简单，我们的想法是逐行读取该流对象，将其加入到一个StringBuffer对象中，最后输出整个StringBuffer字符串即可。

	String output;
    StringBuffer sb = new StringBuffer();
	while ((output = br.readLine()) != null) {
    	sb.append(output);
    }
	String jsonString = sb.toString();//the final result

通过上面的方法我们便得到了该json字符串。既然是json字符串，我们就可以解析该json字符串，从而获取我们想要的数据。对Java而言，我们可以使用第三方的json-lib库，从字符串构造json对象，然后解析json对象。

这种方法，***还有一种简单的写法***：

	URL url = new URL("REST_URL_HERE");
	InputStream is = url.openStream();
	ByteArrayOutputStream os = new ByteArrayOutputStream();
	int retVal;
	while ((retVal = is.read()) != -1) {
	    os.write(retVal);
	}
	final String tweetsString = os.toString();

###2. 使用Jersey
前面的博客我们简单的介绍了Jersey，Jersey是JSR 311的参考实现，可以用于构造和解析REST API。Jersey的引入可以使问题变的更简单。在使用之前，我们需要引入Jersey库及相关的依赖。

构造Jersey Client, 通过如下的方法建立指定URL的HTTP连接：
	
	javax.ws.rs.client.Client client = javax.ws.rs.client.ClientBuilder.newClient();
    javax.ws.rs.client.WebRarget webTarget = client.target("YOUR_URI").path("CHILD_URI");

通常我们可以将其放在构造的Jersey Client的构造函数中，这样连接的建立工作可以直接在初始化时完成。下面我们只要构造对指向URI的读写方法，可以通过如下的代码完成：
	
    public <T> T find_JSON_REST(Class<T> responseType, String text) throws ClientErrorException {
        WebTarget resource = webTarget;
        resource = resource.queryParam("parameter 1", "parameter value");//set param/value
        resource = resource.queryParam("parameter 2", "parameter value");//set param/value
        return resource.request(javax.ws.rs.core.MediaType.APPLICATION_JSON).get(responseType);
    }

完成以上工作后，我们基本就完成了任务。最后，我们可以编写如下的测试代码。这段代码指定了响应类型为String, 并且传入了一个自定义参数。
	
    /**
     * 
     * @param responseType
     * @param text your self-defined parameter
     * @return
     */
	public static void main(String[] args) {
        TestJerseyClient movieClient = new TestJerseyClient();
        JSONObject jo = JSONObject.fromObject(movieClient.find_JSON_REST(String.class, "YOUR_SELF_DEFINED_PARAMETER"));
        System.out.println(jo.toString());
    }