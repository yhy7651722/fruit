<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类管理</el-breadcrumb-item>
            <el-breadcrumb-item>查看分类</el-breadcrumb-item>
        </el-breadcrumb>
        <el-divider></el-divider>
        <el-form :model="goods" :inline="true" label-width="80px">
            <el-form-item style="float: left" label="所属分类" prop="cid">
                <el-select v-model="goods.cid">
                    <el-option :value="item.id" :label="item.cname" v-for="item in category" :key="item.id">

                    </el-option>


                </el-select>
            </el-form-item>
            <el-form-item style="float: left" label="商品搜索">
                <el-input v-model="goods.gname" prefix-icon="el-icon-user-solid" placeholder="搜索" clearable>
                    <i slot="prefix"></i>
                </el-input>
            </el-form-item>
            <el-form-item style="float: left" label="商品搜索">

                <el-input v-model.number="goods.min_price" style="width: 120px;float: left" prefix-icon="el-icon-user-solid"
                          placeholder="价格搜索" clearable>
                    <i slot="prefix"></i>


                </el-input>

                      <div style="float: left;margin: 0 5px">——</div>
                <el-input v-model.number="goods.max_price" style="width: 120px;float: left" prefix-icon="el-icon-user-solid" placeholder="价格搜索"
                          clearable>
                    <i slot="prefix"></i>

                </el-input>
            </el-form-item>
            <el-form-item >
                <el-button type="primary" @click="submitSelect">提交</el-button>

            </el-form-item>


        </el-form>


        <el-table :data="form" style="width: 100%">
            <el-table-column prop="gid" label="ID"></el-table-column>
            <el-table-column prop="cname" label="所属分类"></el-table-column>
            <el-table-column prop="gname" label="商品名字"></el-table-column>
            <el-table-column prop="mprice" label="商品价格"></el-table-column>
            <el-table-column prop="sale" label="零售价"></el-table-column>
            <el-table-column prop="stock" label="商品库存"></el-table-column>
            <!--<el-table-column prop="brand" label="商品品牌"></el-table-column>-->
            <el-table-column prop="norms" label="商品规格"></el-table-column>
            <el-table-column prop="description" label="商品描述"></el-table-column>
            <!--<el-table-column prop="banner" label="轮播图">-->
            <!--<template slot-scope="scope"-->
            <!--&gt;-->
            <!--<img v-for="(item,index) in (scope.row.banner).split(',')" :key="index" :src="imgHost+item" alt="" :title="scope.row.gname"  width="50">-->
            <!--</template>-->
            <!--</el-table-column>-->
            <!--<el-table-column prop="detail" label="详情图">-->
            <!--<template slot-scope="scope"-->
            <!--&gt;-->
            <!--<img v-for="(item,index) in (scope.row.detail).split(',')" :key="index" :src="imgHost+item" alt="" :title="scope.row.gname"  width="50">-->
            <!--</template>-->
            <!--</el-table-column>-->


            <el-table-column prop="thumb" label="缩略图">
                <template slot-scope="scope"
                >
                    <img :src="imgHost+scope.row.thumb" alt="" :title="scope.row.cname" width="50">
                </template>
            </el-table-column>

            <!--<el-table-column prop="create_time" label="创建时间"></el-table-column>-->
            <!--<el-table-column prop="update_time"   label="更新时间"></el-table-column>-->
            <el-table-column width="200" label="操作">
                <template slot-scope="scope"
                >
                    <router-link :to="{name:'goodscateedit',query:{gid:scope.row.gid}}" tag="el-button">编辑</router-link>
                    <el-button @click="deleteCate(scope.row.gid)">删除</el-button>
                </template>
            </el-table-column>


        </el-table>


        <el-pagination
                :current-page="1" :page-size="2"
                layout="total,  prev, pager, next, jumper" @current-change="changePage" :total='count'>
        </el-pagination>
    </div>
</template>

<script>
    import {HOSTNAME, IMGHOSTNAME,SUCCESS,FAIL} from "../../config/base";
    import axios from 'axios'

    export default {
        name: "query",
        data() {
            return {
                category:[],
                count: 0,
                goods:{cid:"",
                    gname:"",
                    min_price:"",
                    max_price:'',},
                form: [],
                imgHost: IMGHOSTNAME,
                current: 1
            }
        },
        methods: {
            submitSelect(){
                this.current=1;
                 this.getForm()
            },
            changePage(i) {
                this.current = i
            },

            deleteCate(id) {
                let token = sessionStorage.getItem('token');
                fetch(HOSTNAME + '/api/goods/' + id, {
                    method: "DELETE",
                    headers: {
                        'token': token
                    }
                }).then(res => res.json())
                    .then(data => {

                        if (data.code == 200) {
                            this.$message.success(data.msg);
                            this.form = this.form.filter(ele => ele.gid != id);
                        }
                    })


            },
            getForm() {
                //     fetch(HOSTNAME + '/api/goods', {
                //         headers: {
                //             'Content-Type': 'application/json',
                //             'token': sessionStorage.getItem('token')
                //         }
                //     }).then(res => res.json())
                //         .then(data => {
                //             if (data.code == 200) {
                //
                //                 this.form = data.data
                //             } else if (data.code == 404) {
                //                 this.$message.error(data.msg)
                //             }
                //         })
                // }
                let pagelimit={limit:this.limit,page:this.current};
                let params=Object.assign({},pagelimit,this.goods);
                axios.get(HOSTNAME + '/api/goods', {
                    params
                }).then(res => {

                    res = res.data;
                    if (res.code == 200 && res.count) {
                        this.form = res.data;


                        this.count = res.count;

                    }

                }).catch(error => {
                    console.log(error)
                })
            },
            getcategory() {
                fetch(HOSTNAME + '/api/category', {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json',
                        'token': sessionStorage.getItem('token')
                    }
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.code == SUCCESS) {
                            this.loading = false;

                            this.category = data.data;

                        } else if (data.code == FAIL) {
                            this.$message.error(data.msg)
                        }
                    })

            },
        },
        watch: {
            current() {
                this.getForm()
            }
        },

        beforeMount() {
            this.getForm();
            this.getcategory()
        }


    }
</script>

<style scoped>

</style>