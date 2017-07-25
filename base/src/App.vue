<script>
import projects from './pages.config.js'
import './assets/logo.png'
import './assets/echarts-map2.png'
export default {
  name: 'app',
  data() {
    return {
      projects: projects  
    }
  }
}
</script>

<template>
<div id="app">
  <div class="layout">
    <Menu mode="horizontal" theme="dark" active-name="1">
        <div class="layout-nav">
            <Menu-item name="1">
                <Icon type="ios-keypad"></Icon>
                学习项目总结
            </Menu-item>
        </div>
    </Menu>
  </div>
  <Row>
    <Col :xs="12" :sm="12" :md="8" :lg="6"
      v-for="(project, key) in projects" :key="`project${key}`"
    >
      <Card style="width:100%">
        <p slot="title">
            <Icon type="map"></Icon>
            {{ project.title }}
        </p>
        <div class="img-wrap">
          <img :src="project.viewimg" height="auto" width="100%">
        </div>
        <div>
          <a :href="project.demourl" slot="extra">
              查看demo
          </a>
          <a :href="project.github" slot="extra" style="float: right;">
              Github地址
          </a>
        </div>
      </Card>
    </Col>
  </Row>
    
</div>
</template>

<style>
#app {
  /* font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px; */
}
.layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
}
.layout-logo{
    width: 100px;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 15px;
    left: 20px;
}
.layout-nav{
    width: 420px;
    margin: 0 auto;
}
.layout-assistant{
    width: 300px;
    margin: 0 auto;
    height: inherit;
}
.layout-breadcrumb{
    padding: 10px 15px 0;
}
.layout-content{
    min-height: 200px;
    margin: 15px;
    overflow: hidden;
    background: #fff;
    border-radius: 4px;
}
.layout-content-main{
    padding: 10px;
}
.layout-copy{
    text-align: center;
    padding: 10px 0 20px;
    color: #9ea7b4;
}
.ivu-col {padding: 10px;}
.img-wrap { height: 200px; overflow: hidden;  }
.ivu-card-head {}
</style>
