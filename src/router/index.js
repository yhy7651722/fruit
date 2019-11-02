import Vue from 'vue'
import VueRouter from 'vue-router'



Vue.use(VueRouter);

const routes = [

    {
        path: '/login',
        name: 'login',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/login.vue'),
        meta: {title: '商品登陆'}
    },

    {
        path: '/',
        name: 'mains',
        component: () => import( '../views/main/Mains.vue')
        , meta: {title: '商品后台管理',auth:true},

        children: [
            {
                path: 'goodscateedit',
                component: () => import('../views/goods/cateedit.vue'),
                name: "goodscateedit",
                meta: {title: '商品编辑'}
            },
            {
                path: 'goodsinsert',
                component: () => import( '../views/goods/goodsinsert'),
                name: "goodsinsert",
                meta: {title: '商品插入',auth:true}
            },
            {
                path: 'goodsselect',
                component: () => import( '../views/goods/goodsselect'),
                name: "goodsselect",
                meta: {title: '商品查看',auth:true}
            },
            {
            path: 'insert',
            component: () => import( '../views/category/insert'),
            name: "insert",
            meta: {title: '商品分类插入',auth:true}
        },
            {
                path: 'select',
                component: () => import( '../views/category/select'),
                name: "select",
                meta: {title: '商品分类查看',auth:true}
            },
            {
                path: 'cateedit',
                component: () => import('../views/category/cateedit.vue'),
                name: "cateedit",
                meta: {title: '商品编辑'}
            },
        ]

    },


]

const router = new VueRouter({
    routes
});
router.beforeEach((to, form, next) => {
    let title = to.meta.title || 'xxx的生鲜APP';
    document.title = title;
    if (to.meta.auth) {
       let token=sessionStorage.getItem('token');
       if(token&& token !=''){
           next();
       }else {
           next('/login?redirect='+to.name)
       }
    } else {
        next();
    }

});

export default router
