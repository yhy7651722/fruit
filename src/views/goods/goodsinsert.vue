<template>
    <div v-loading="loading" element-loading-text="拼命加载中"
         element-loading-spinner="el-icon-loading"
         element-loading-background="rgba(0, 0, 0, 0.8)">
        <div>
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>添加分类</el-breadcrumb-item>

            </el-breadcrumb>
            <el-divider></el-divider>
        </div>

        <el-form :model="form" ref="form" label-width="80px" :rules="rules">
            <el-form-item label="所属分类">
                <el-select v-model="form.cid">
                    <el-option :value="item.id" :label="item.cname" v-for="item in category" :key="item.id">

                    </el-option>


                </el-select>
            </el-form-item>
            <el-form-item label="商品名字" prop="gname">
                <el-input prefix-icon="el-icon-user-solid" v-model="form.gname" placeholder="请输入5到30个字符" clearable>
                    <i slot="prefix"></i>
                </el-input>
            </el-form-item>
            <el-form-item label="商品描述" prop="description">
                <el-input prefix-icon="el-icon-user-solid" v-model="form.description" placeholder="请输入5到30个字符"
                          clearable>
                    <i slot="prefix"></i>
                </el-input>
            </el-form-item>
            <el-form-item label="商品原价" prop="mprice">
                <el-input prefix-icon="el-icon-user-solid" v-model.number="form.mprice" placeholder="mprice" clearable>
                    <i slot="prefix"></i>
                </el-input>
            </el-form-item>
            <el-form-item label="商品现价" prop="sale">
                <el-input prefix-icon="el-icon-user-solid" v-model.number="form.sale" placeholder="sale" clearable>
                    <i slot="prefix"></i>
                </el-input>
            </el-form-item>
            <el-form-item label="商品库存" prop="stock">
                <el-input prefix-icon="el-icon-user-solid" v-model="form.stock" placeholder="库存量" clearable>
                    <i slot="prefix"></i>
                </el-input>
            </el-form-item>
            <el-form-item label="商品品牌" prop="brand">
                <el-input prefix-icon="el-icon-user-solid" v-model="form.brand" placeholder="请输入品牌" clearable>
                    <i slot="prefix"></i>
                </el-input>
            </el-form-item>
            <el-form-item label="商品规格" prop="norms">
                <el-input prefix-icon="el-icon-user-solid" v-model="form.norms" placeholder="请输入规格" clearable>
                    <i slot="prefix"></i>
                </el-input>
            </el-form-item>
            <el-form-item label="轮播图">

                <ul id="banner-box">

                    <li  v-for="(item,index) in bannerArr"
                         :key="index"
                         @mouseenter="showMask(index)"
                         @mouseleave="hiddenMask(index)">
                        <div class="mask" ref="mask">
                            <i class="el-icon-plus" @click="previewImage(index)"></i>
                            <i class="el-icon-delete" @click="deleteimg(index)"></i>
                        </div>
                        <img :src="ImgHostName+item" alt="">
                    </li>
                    <el-upload :action="HostName+'/api/upload'"
                               :on-success="bannerUploadSuccess"
                               multiple :limit="3"

                               :show-file-list="false">
                        <i class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </ul>
            </el-form-item>
            <el-form-item label="详情">

                <ul id="detail-box">

                    <li  v-for="(item,index) in detailArr"
                         :key="index"
                         @mouseenter="shows(index)"
                         @mouseleave="hidden(index)">
                        <div class="ms" ref="maskk">
                            <i class="el-icon-plus" @click="previewI(index)"></i>
                            <i class="el-icon-delete" @click="deletedetail(index)"></i>
                        </div>
                        <img  :src="ImgHostName+item" alt="">
                    </li>
                    <el-upload :action="HostName+'/api/upload'"
                               :on-success="detailUploadSuccess"
                            :limit="3"   multiple  :show-file-list="false"

                               >
                        <i class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </ul>
            </el-form-item>


            <el-form-item label="缩略图片" prop="thumb">
                <el-upload :action="uploadurl" :on-success="uploadSuccess"
                           v-model="form.thumb"

                >
                    <img v-if="form.thumb" :src="ImgHostName+form.thumb" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>


            <el-form-item>
                <el-button type="primary" @click="submit">提交</el-button>

            </el-form-item>
        </el-form>
        <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
    </div>
</template>

<script>
    import {SUCCESS, FAIL,TOKENFAIL, IMGHOSTNAME, HOSTNAME} from "../../config/base";
     // import {api} from "../../config/api";

    export default {

        name: "insert",
        data() {
            return {
                dialogImageUrl:'',
                dialogVisible:false,
                bannerArr: [],
                detailArr:[],
                loading: true,
                HostName: HOSTNAME,
                ImgHostName: IMGHOSTNAME,
                uploadurl: 'http://localhost/fruit-end/public/index.php/api/upload',
                imageUrl: '',
                category: [],

                form: {

                    gname: "",
                    thumb: "",
                    mprice: "",
                    sale: "",
                    stock: "",
                    banner: '',
                    detail: "",
                    cid: "",
                    description: '',
                    brand: '',
                    norms: '',


                },

                rules: {
                    gname: [
                        {required: true, message: '请输入分类名', trigger: 'blur'},
                        {min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'}
                    ],
                    thumb: [
                        {required: true, message: '请输入图片', trigger: 'blur'},

                    ],
                    sale: [
                        {required: true, message: '请输入商品零售价格', trigger: 'change'}

                    ],
                    stock: [
                        {required: true, message: '请输入商品库存', trigger: 'change'}

                    ],
                    mprice: [
                        {required: true, message: '请输入商品价格', trigger: 'change'}

                    ],
                    banner: [
                        {required: true, message: '请输入商品轮播图', trigger: 'change'}

                    ],
                    detail: [
                        {required: true, message: '请输入商品详情', trigger: 'change'}

                    ],
                    cid: [
                        {required: true, message: '请输入商品分类', trigger: 'change'}

                    ],


                }

            }
        },
        methods: {
            shows(index){
                this.$refs.maskk[index].style.display='flex';
            },
            hidden(index){
                this.$refs.maskk[index].style.display='none';
            },

            showMask(index){
                this.$refs.mask[index].style.display='flex';
            },
            hiddenMask(index){
                this.$refs.mask[index].style.display='none';
            },
            uploadSuccess(res) {

                this.form.thumb = res.src;
                console.log(res);


            },
            bannerUploadSuccess(res) {
                this.bannerArr.push(res.src);
                this.form.gbanner = this.bannerArr.join(',');
                // this.$message.warning('最多3张')

                // this.form.banner=this.bannerArr.join();
            },
            deletedetail(index){
                this.detailArr.splice(index,1)
            },
            deleteimg(index){
               this.bannerArr.splice(index,1)
            },
            previewI(index){
                this.dialogVisible=true;
                this.dialogImageUrl=this.ImgHostName+this.detailArr[index];

            },

            previewImage(index){
                this.dialogVisible=true;
                this.dialogImageUrl=this.ImgHostName+this.bannerArr[index];

            },
            detailUploadSuccess(res) {
                this.detailArr.push(res.src);
                this.form.detail = this.detailArr.join(',');

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


            submit() {
                let token = sessionStorage.getItem('token');
                fetch('http://localhost/fruit-end/public/index.php/api/goods', {
                    method: "POST",
                    body: JSON.stringify(this.form),
                    headers: {
                        'Content-type': "application/json",
                        'token': token,
                    }
                })
                    .then(res => res.json())
                    .then(data => {
                        let {code, msg} = data;
                        if (code == TOKENFAIL) {
                            this.$message({
                                type: "waring",
                                message: msg
                            })
                        }
                        if (data.code == SUCCESS) {
                            this.$message.success(data.msg);
                            this.$refs['form'].resetFields();
                        } else if (data.code == FAIL) {

                            this.$message.error(data.msg)
                        }

                    })
            },
            // submit(){
            //     api('POST','/api/goods',this.form).then(res=>res.json).catch(
            //
            //     )
            // }


        },
        watch: {
            bannerArr() {
                this.form.banner = this.bannerArr.join();
            },

        },
        beforeMount() {
            this.getcategory()
        }
    }
</script>

<style lang="scss">

    .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }

    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }

    .el-form {
        width: 800px;
    }
    #banner-box{
        display: flex;
        flex-wrap: wrap;
    >li{
        width: 150px;
        height: 150px;
        margin: 5px;
        border:solid 1px #ccc;
        position: relative;
        border-radius: 5px;
        overflow: hidden;
    >.mask{
        position: absolute;
        top: 0;
        left: 0;

        width: 100%;
        height:100%;
        background: rgba(0,0,0,.3);

        justify-content: center;
        align-items: center;
        display: none;
    >i{
        margin-left: 20px;
        color: #fff;
    }
    }
    >img{
        height: 100%;
        width: 100%;
    }
    }
    }
    #detail-box{
        display: flex;
        flex-wrap: wrap;
        >li{
            width: 150px;
            height: 150px;
            margin: 5px;
            border:solid 1px #ccc;
            position: relative;
            border-radius: 5px;
            overflow: hidden;
            >.ms{
                position: absolute;
                top: 0;
                left: 0;

                width: 100%;
                height:100%;
                background: rgba(0,0,0,.3);

                justify-content: center;
                align-items: center;
                display: none;
                >i{
                    margin-left: 20px;
                    color: #fff;
                }
            }
            >img{
                height: 100%;
                width: 100%;
            }
        }
    }

</style>