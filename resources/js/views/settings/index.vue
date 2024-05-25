<script>
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header";
import Panel from "@/views/settings/components/Panel.vue";
export default {
  components: {
    Panel,
    Layout,
    PageHeader,
  },
  methods: {


  },
  data(){
    return {
      systemPanel:{
        title: 'Hệ thống',
        items: [
          {
            'icon': 'star',
            'url' : 'settings/organization/information',
            'title': 'Thông tin công ty',
            'desc': 'Thông tin doanh nghiệp'
          },
        ]
      },
      productsPanel:{
        title: 'Sản phẩm & Nhà cung cấp',
        items: [
          {
            'icon': 'star',
            'url' : 'https://crm.vietnamtouristvn.vn/admin/supplier-group/index',
            'title': 'Chuỗi thương hiệu',
            'desc': 'Thêm và quản lý chuỗi thương hiệu'
          },
          {
            'icon': 'star',
            'url' : 'settings/amenities',
            'title': 'Thuộc Tính',
            'desc': 'Thêm và quản lý thuộc tính'
          },
          {
            'icon': 'star',
            'url' : 'https://crm.vietnamtouristvn.vn/admin/airline',
            'title': 'Hãng hàng không',
            'desc': 'Thêm và quản lý hãng hàng không'
          },
        ]
      },
      ordersPanel:{
        title: 'Thiết lập bán hàng',
        items: [
          {
            'icon': 'star',
            'url' :  this.$router.resolve({ name: 'settings.customer_source'}).path,
            'title': this.$t('nguonkhachhang'),
            'desc': this.$t('ghichu-nguonkhachhang')
          },
          {
            'icon': 'database',
            'url' : this.$router.resolve({ name: 'settings.customer_type'}).path,
            'title': this.$t('loaikhachhang'),
            'desc': this.$t('ghichu-loaikhachhang')
          },
          {
            'icon': 'star',
            // 'url' : this.$router.resolve({ name: 'settings.reason.index'}).path,
            'url':'',
            'title': this.$t('lydohuy'),
            'desc': this.$t('ghichu-lydohuy')
          },
          {
            'icon': 'star',
            'url' : 'https://crm.vietnamtouristvn.vn/admin/price-rule',
            'title': 'Đối tượng tính giá',
            'desc': 'Thêm và quản lý đối tượng tính giá'
          },
        ]
      },
      organizationPanel: {
          title: 'Thông tin công ty',
          items: [
            {
              'icon': 'star',
              'url' : 'settings/organization/branchs',
              'title': 'Chi Nhánh',
              'desc': 'Quản lý chi nhánh'
            },
            {
              'icon': 'star',
              'url' : 'settings/organization/departments',
              'title': 'Phòng Ban',
              'desc': 'Quản lý Phòng Ban'
            },
            {
              'icon': 'star',
              'url' : 'settings/organization/unit',
              'title': 'Cơ cấu tổ chức',
              'desc': 'Quản lý Cơ cấu tổ chức'
            }
          ]
      }
    }
  }
};
</script>
<style scoped>
.icons {
  display: grid;
  grid-gap: 0.5rem;
  grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
  list-style: none;
  margin: 0;
  padding: 0;
}

.icons > li {
  background-color: #f8f8f8;
  padding: 0.5rem 1rem;
  transition: color 0.15s;
}

.icons > li:hover {
  color: #0074d9;
}

.icons > li > i {
  vertical-align: middle;
}

.icons > li > span {
  color: gray;
  margin-left: 0.5rem;
  transition: color 0.15s;
}

.icons > li:hover > span {
  color: inherit;
}
</style>
<template>
  <Layout>
    <PageHeader title="Settings" pageTitle="Dashboard" />
    <BContainer fluid>
      <div class="row">
        <Panel :panel-items="systemPanel"/>
        <Panel :panel-items="organizationPanel"/>
        <Panel :panel-items="productsPanel"/>
        <Panel :panel-items="ordersPanel"/>
      </div>
    </BContainer>
  </Layout>
</template>
