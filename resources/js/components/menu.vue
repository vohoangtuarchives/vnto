<script>
import {
  layoutComputed
} from "@/stores/helpers";
import router from '@/router'; 
import store from "@/state/store";
import tokenService from '@/services/token.service';

export default {
  data() {
    return {
      userId:'0',
      settings: {
        minScrollbarLength: 60,
      },
    };
  },

  computed: {
  
    
    store() {
      return store
    },
    ...layoutComputed,
    layoutType: {
      get() {
        return this.$store ? this.$store.state.layout.layoutType : {} || {};
      },
    },
  },

  watch: {
    $route: {
      handler: "onRoutechange",
      immediate: true,
      deep: true,
    },
  },
  created() {
    // Tạo một watcher cho getter 'layout/getMenu'
    this.$store.watch(
      () => this.$store.getters['layout/getMenu'],
      (menu, ) => {
      
        if(menu)
          this.handleActiveMenu();
        }
        
      
    );
  },





  mounted() {
    


    this.userId = tokenService.getUserField('id');  
    try{
    this.initActiveMenu();
    if (this.rmenu == 'vertical' && this.layoutType == 'twocolumn') {
      document.documentElement.setAttribute("data-layout", "vertical");
    }
    document.getElementById('overlay').addEventListener('click', () => {
      document.body.classList.remove('vertical-sidebar-enable');
    });

    window.addEventListener("resize", () => {
      if (this.layoutType == 'twocolumn') {
        var windowSize = document.documentElement.clientWidth;
        if (windowSize < 767) {
          document.documentElement.setAttribute("data-layout", "vertical");
          this.rmenu = 'vertical';
          localStorage.setItem('rmenu', 'vertical');
        } else {
          document.documentElement.setAttribute("data-layout", "vertical");
          this.rmenu = 'twocolumn';
          localStorage.setItem('rmenu', 'twocolumn');
          setTimeout(() => {
            this.initActiveMenu();
          }, 50);

        }
      }
    });
    if (document.querySelectorAll(".navbar-nav .collapse")) {
      let collapses = document.querySelectorAll(".navbar-nav .collapse");

      collapses.forEach((collapse) => {
        // Hide sibling collapses on `show.bs.collapse`
        collapse.addEventListener("show.bs.collapse", (e) => {
          e.stopPropagation();
          let closestCollapse = collapse.parentElement.closest(".collapse");
          if (closestCollapse) {
            let siblingCollapses =
              closestCollapse.querySelectorAll(".collapse");
            siblingCollapses.forEach((siblingCollapse) => {
              if (siblingCollapse.classList.contains("show")) {
                siblingCollapse.classList.remove("show");
                siblingCollapse.parentElement.firstChild.setAttribute("aria-expanded", "false");
              }
            });
          } else {
            let getSiblings = (elem) => {
              // Setup siblings array and get the first sibling
              let siblings = [];
              let sibling = elem.parentNode.firstChild;
              // Loop through each sibling and push to the array
              while (sibling) {
                if (sibling.nodeType === 1 && sibling !== elem) {
                  siblings.push(sibling);
                }
                sibling = sibling.nextSibling;
              }
              return siblings;
            };
            let siblings = getSiblings(collapse.parentElement);
            siblings.forEach((item) => {
              if (item.childNodes.length > 2) {
                item.firstElementChild.setAttribute("aria-expanded", "false");
                item.firstElementChild.classList.remove("active");
              }
              let ids = item.querySelectorAll("*[id]");
              ids.forEach((item1) => {
                item1.classList.remove("show");
                item1.parentElement.firstChild.setAttribute("aria-expanded", "false");
                item1.parentElement.firstChild.classList.remove("active");
                if (item1.childNodes.length > 2) {
                  let val = item1.querySelectorAll("ul li a");

                  val.forEach((subitem) => {
                    if (subitem.hasAttribute("aria-expanded"))
                      subitem.setAttribute("aria-expanded", "false");
                  });
                }
              });
            });
          }
        });

        // Hide nested collapses on `hide.bs.collapse`
        collapse.addEventListener("hide.bs.collapse", (e) => {
          e.stopPropagation();
          let childCollapses = collapse.querySelectorAll(".collapse");
          childCollapses.forEach((childCollapse) => {
            let childCollapseInstance = childCollapse;
            childCollapseInstance.classList.remove("show");
            childCollapseInstance.parentElement.firstChild.setAttribute("aria-expanded", "false");
          });
        });
      });
    }
  }catch(error){
    console.error(error);
  }
  },

  methods: {
    handleActiveMenu(){
      let menu = this.$store.getters['layout/getMenu'];
      const findPath = (routes, name,parent) => {
          for (const route of routes) {
            if (route.name === name) {
              return parent+route.path;
            }
            if (route.children) {
              const path = findPath(route.children, name,route.path);
              if (path) {
                return path;
              }
            }
          }
        };
        if(menu!=null){
         
        
          const path = findPath(router.options.routes, menu);
          if(path!=null){
            this.initActiveMenu(path);
          }
          
          
        
        }
    },
    onRoutechange(ele) {
      
      this.initActiveMenu(ele.path);
      if (document.getElementsByClassName("mm-active").length > 0) {
        const currentPosition = document.getElementsByClassName("mm-active")[0].offsetTop;
        if (currentPosition > 500)
          if (this.$refs.isSimplebar)
            this.$refs.isSimplebar.value.getScrollElement().scrollTop = currentPosition + 300;
      }
      this.handleActiveMenu();
    },

    initActiveMenu(path) {
     
      let pathName = window.location.pathname;
      if(path){
        pathName = path;
       
      }
   
     
      const ul = document.getElementById("navbar-nav");
      if (ul) {
        const items = Array.from(ul.querySelectorAll("a.nav-link"));
        let activeItems = items.filter((x) => x.classList.contains("active"));
        this.removeActivation(activeItems);
        let matchingMenuItem = items.find((x) => {
          return x.getAttribute("href") === pathName;
        });
        if (matchingMenuItem) {
          this.activateParentDropdown(matchingMenuItem);
        } else {
          var id = pathName.replace("/", "");
          
          if (id) document.body.classList.add("twocolumn-panel");
          this.activateIconSidebarActive(pathName);
        }
      }
    },
    removeActivation(items) {
      items.forEach((item) => {
        if (item.classList.contains("menu-link")) {
          if (!item.classList.contains("active")) {
            item.setAttribute("aria-expanded", false);
          }
          if(item.nextElementSibling){
          item.nextElementSibling.classList.remove("show");
          }
        }
        if (item.classList.contains("nav-link")) {
          if (item.nextElementSibling) {
            item.nextElementSibling.classList.remove("show");
          }
          item.setAttribute("aria-expanded", false);
        }
        item.classList.remove("active");
      });
    },

    activateParentDropdown(item) {
      // navbar-nav menu add active
      item.classList.add("active");
      let parentCollapseDiv = item.closest(".collapse.menu-dropdown");
      if (parentCollapseDiv) {
        // to set aria expand true remaining
        parentCollapseDiv.classList.add("show");
        parentCollapseDiv.parentElement.children[0].classList.add("active");
        parentCollapseDiv.parentElement.children[0].setAttribute("aria-expanded", "true");
        if (parentCollapseDiv.parentElement.closest(".collapse.menu-dropdown")) {
          if (parentCollapseDiv.parentElement.closest(".collapse.menu-dropdown").previousElementSibling) {
            if (parentCollapseDiv.parentElement.closest(".collapse.menu-dropdown").previousElementSibling.parentElement.closest(".collapse.menu-dropdown")) {
              const grandparent = parentCollapseDiv.parentElement.closest(".collapse.menu-dropdown").previousElementSibling.parentElement.closest(".collapse.menu-dropdown");
              this.activateIconSidebarActive("#" + grandparent.getAttribute("id"));
              grandparent.classList.add("show");
            }
          }
          this.activateIconSidebarActive("#" + parentCollapseDiv.parentElement.closest(".collapse.menu-dropdown")
            .getAttribute("id"));

          parentCollapseDiv.parentElement.closest(".collapse").classList.add("show");
          if (parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling)
            parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling.classList.add("active");
          return false;
        }
        this.activateIconSidebarActive("#" + parentCollapseDiv.getAttribute("id"));
        return false;
      }
      return false;
    },
    activateIconSidebarActive(id) {
      var menu = document.querySelector(
        "#two-column-menu .simplebar-content-wrapper a[href='" +
        id +
        "'].nav-icon"
      );
      if (menu !== null) {
        menu.classList.add("active");
      }
    },
  },
};
</script>

<template>
  <BContainer fluid>
    <div id="two-column-menu"></div>

    <template v-if="layoutType === 'vertical' || layoutType === 'semibox'">
      <ul class="navbar-nav h-100" id="navbar-nav">
        <li class="menu-title">
          <span data-key="t-menu"> {{ $t("t-menu") }}</span>
        </li>
        <li class="nav-item">
          <router-link class="nav-link menu-link" to="/">
            <i class="ri-dashboard-2-line"></i>
            <span data-key="t-dashboards">{{ $t("t-dashboards") }}</span>
          </router-link>
        </li>
        <li class="nav-item" > 
          <BLink class="nav-link menu-link" href="#informationUser" data-bs-toggle="collapse" role="button"
                 aria-expanded="false" aria-controls="sidebarSettings">
                 <i class="ri-file-user-line"></i>
            <span data-key="t-settings">{{ $t("your-info") }}</span>
          </BLink>
          <div class="collapse menu-dropdown" id="informationUser">
            <ul class="nav nav-sm flex-column">
              
              <li class="nav-item">
                <router-link :to="{'name':'information.job.description' ,params:{id:userId} }" class="nav-link" data-key="your-info">
                  {{$t('mota-congviec') }}
                </router-link>
              </li>
             
            </ul>
          </div>
        </li>
        <li class="nav-item">
          <router-link class="nav-link menu-link" to="/newsfeed">
            <i class="ri-article-line"></i>
            <span data-key="t-newsfeed">{{ $t("t-newsfeed") }}</span>
          </router-link>
        </li>
        
        <li class="nav-item">
          <router-link class="nav-link menu-link" :to="{name:'customer.index'}">
            <i class="ri-user-follow-line"></i>
            <span data-key="t-dashboards">{{ $t("t-khachhang") }}</span>
          </router-link>
        </li>
        
        <li class="nav-item" > 
          <BLink class="nav-link menu-link" href="#staff" data-bs-toggle="collapse" role="button"
                 aria-expanded="false" aria-controls="sidebarSettings">
            <i class="ri-aliens-line"></i>
            <span data-key="t-settings">{{ $t("qlnhansu") }}</span>
          </BLink>
          <div class="collapse menu-dropdown" id="staff">
            <ul class="nav nav-sm flex-column">
              
              <li class="nav-item">
                <router-link :to="{'name':'staff.list'}" class="nav-link" data-key="cau-hinh">
                  {{$t('danhsachnhansu') }}
                </router-link>
                
              </li>
             
            </ul>
          </div>
        </li>
        <li class="nav-item">
          <BLink class="nav-link menu-link" ref="menu.setting" href="#sidebarSettings" data-bs-toggle="collapse" role="button"
                 aria-expanded="false" aria-controls="sidebarSettings">
            <i class="ri-settings-2-line"></i>
            <span data-key="t-settings">{{ $t("t-settings") }}</span>
          </BLink>
          <div class="collapse menu-dropdown" id="sidebarSettings">
            <ul class="nav nav-sm flex-column">
              <li class="nav-item">
                <router-link to="/settings" ref="menu.setting.setting" class="nav-link" data-key="cau-hinh">
                  Cấu Hình
                </router-link>
              </li>
              <li class="nav-item">
                <router-link to="/" class="nav-link" data-key="t-feather">
                  Khuyến Mãi
                </router-link>
              </li>
            </ul>
          </div>
        </li>
        <li class="nav-item">
          <BLink class="nav-link menu-link" href="#sidebarTimeSheet" data-bs-toggle="collapse" role="button"
                 aria-expanded="false" aria-controls="sidebarTimeSheet">
            <i class="ri-time-line"></i>
            <span data-key="t-timesheet">{{ $t("timesheet.menu-title") }}</span>
          </BLink>
          <div class="collapse menu-dropdown" id="sidebarTimeSheet">
            <ul class="nav nav-sm flex-column">
              <li class="nav-item">
                <router-link :to="{'name': 'timesheet.working-shift.view'}" class="nav-link" data-key="cau-hinh">
                  Ca Làm Việc
                </router-link>
              </li>
              <li class="nav-item">
                <router-link :to="{'name': 'timesheet.working-shift.view'}" class="nav-link" data-key="cau-hinh">
                  Bảng chấm công chi tiết
                </router-link>
              </li>
            </ul>
          </div>
        </li>
        <li class="nav-item">
          <BLink class="nav-link menu-link" href="#sidebarAboutCompany" data-bs-toggle="collapse" role="button"
                 aria-expanded="false" aria-controls="sidebarAboutCompany">
            <i class="ri-file-paper-2-fill"></i>
            <span data-key="t-timesheet">{{ $t("t-thongtincongty") }}</span>
          </BLink>
          <div class="collapse menu-dropdown" id="sidebarAboutCompany">
            <ul class="nav nav-sm flex-column">
              <li class="nav-item">
                <router-link :to="{ name: 'static.company', params: { type: 'about-company' } , query: { title: $t('t-about') } }" class="nav-link" data-key="cau-hinh">
                  {{$t('t-about')}}
                </router-link>
              </li>
              <li class="nav-item">
                <router-link :to="{ name: 'static.company', params: { type: 'rules-company' } , query: { title: $t('t-rules') } } " class="nav-link" data-key="cau-hinh">
                  {{$t('t-rules')}}
                </router-link>
              </li>
              <li class="nav-item">
                <router-link :to="{ name: 'static.company', params: { type: 'cultural-company' } , query: { title: $t('t-cultural') } } " class="nav-link" data-key="cau-hinh">
                  {{$t('t-cultural')}}
                </router-link>
              </li>
              <li class="nav-item">
                <router-link :to="{ name: 'settings.organization.unit' }" class="nav-link" data-key="cau-hinh">
                  Sơ đồ tổ chức
                </router-link>
              </li>
            </ul>
          </div>
        </li>
        <li class="nav-item">
          <BLink class="nav-link menu-link" href="#sidebarPosts" data-bs-toggle="collapse" role="button"
                 aria-expanded="false" aria-controls="sidebarPosts">
                 <i class="ri-file-list-3-line"></i>
            <span data-key="t-timesheet">{{ $t("t-hanhchinhnhanhsu") }}</span>
          </BLink>
          <div class="collapse menu-dropdown" id="sidebarPosts">
            <ul class="nav nav-sm flex-column">
              <li class="nav-item">
                <router-link :to="{ name: 'posts.man', params: { type: 'regulations' }, query: { title: $t('t-regulation') } }" class="nav-link" data-key="post-bai">
                  {{$t('t-regulation')}}
                </router-link>
              </li>
              <li class="nav-item">
                <router-link :to="{ name: 'posts.man', params: { type: 'decisions' }, query: { title: $t('t-decision') } }" class="nav-link" data-key="post-bai">
                  {{$t('t-decision')}}
                </router-link>
              </li>
              <li class="nav-item">
                <router-link :to="{ name: 'posts.man', params: { type: 'notifications' }, query: { title: $t('t-notification') } }" class="nav-link" data-key="post-bai">
                  {{$t('t-notification')}}
                </router-link>
              </li>
              <li class="nav-item">
                <router-link :to="{ name: 'posts.man', params: { type: 'power-of-attorney' }, query: { title: $t('t-power-of-attorney') } }" class="nav-link" data-key="post-bai">
                  {{$t('t-power-of-attorney')}}
                </router-link>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </template>
  </BContainer>
</template>