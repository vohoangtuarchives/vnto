<template>
  <Layout>
    <PageHeader title="ca làm vệc " pageTitle="Dashboard" />
    <BForm>
      <BCard>
          <BCardHeader class="border-bottom-0"></BCardHeader>
        <!--start:item.name-->
          <BRow class="mb-3">
            <BCol cols="12" xl="12" md="12">
              <BRow class="align-items-center">
                <BCol  xl="2" md="3">
                  <label :for="name" class="m-0">{{ this.$t('timesheet.working-shift.form.name') }} (<span class="text-danger">*</span>)</label>
                </BCol>
                <BCol xl="8" md="9">
                  <BFormInput id="name" type="text" name="name" v-model="item.name"/>
                </BCol>
              </BRow>
            </BCol>
          </BRow>
        <!--end:item.name-->
        <!--start:item.code-->
        <BRow class="mb-3">
          <BCol cols="12" xl="12">
            <BRow class="align-items-center">
              <BCol  xl="2" md="3">
                <label :for="code" class="m-0">{{ this.$t('timesheet.working-shift.form.code') }} (<span class="text-danger">*</span>)</label>
              </BCol>
              <BCol xl="8" md="9">
                <BFormInput id="code" type="text" name="code" v-model="item.code"/>
              </BCol>
            </BRow>
          </BCol>
        </BRow>
        <BRow class="mb-3">
          <BCol cols="12" xl="12">
            <BRow class="align-items-center mb-3">
              <BCol  xl="2" md="3">
                <label :for="start_time" class="m-0">{{ this.$t('timesheet.working-shift.form.start_time') }} (<span class="text-danger">*</span>)</label>
              </BCol>
              <BCol xl="2" md="5">
                <BFormInput id="start_time" type="time" name="start_time" v-model="item.start_time"/>
              </BCol>
              <BCol  xl="2">
                <div class="d-flex align-items-center">
                  <InputSwitch v-model="item.check_start_time" class="my-2 me-2"/>
                  <label class="form-label  mb-0">{{ this.$t("timesheet.working-shift.form.check_start_time") }}</label>
                </div>
              </BCol>
            <template v-if="item.check_start_time">
              <BCol  xl="2" lg="3">
                <BRow class="align-items-center mb-3 ">
                  <BCol  xl="2">
                    <label :for="check_start_time_from" class="m-0">{{ this.$t('timesheet.working-shift.form.check_start_time_from') }}</label>
                  </BCol>
                  <BCol xl="10">
                    <BFormInput id="check_start_time_from" type="time" name="check_start_time_from" v-model="item.check_start_time_from" />
                  </BCol>
                </BRow>
              </BCol>

              <BCol  xl="2" lg="3">
                <BRow class="align-items-center mb-3 ">
                  <BCol  xl="2">
                    <label :for="check_start_time_to" class="m-0">{{ this.$t('timesheet.working-shift.form.check_start_time_to') }}</label>
                  </BCol>
                  <BCol xl="10">
                    <BFormInput id="check_start_time_to" type="time" name="check_start_time_to" v-model="item.check_start_time_to" />
                  </BCol>
                </BRow>
              </BCol>
            </template>

            </BRow>
          </BCol>
        </BRow>
        <!--end:item.start_time-->
        <!--start:item.check_end_time-->
        <BRow class="mb-3">
          <BCol cols="12" xl="12">
            <BRow class="mb-3 align-items-center ">
              <BCol   xl="2">
                <label :for="end_time" class="m-0">{{ this.$t('timesheet.working-shift.form.end_time') }} (<span class="text-danger">*</span>)</label>
              </BCol>
              <BCol xl="2">
                <BFormInput id="end_time" type="time" name="end_time" v-model="item.end_time"/>
              </BCol>

              <BCol  xl="2">
                <div class="d-flex align-items-center">
                  <InputSwitch v-model="item.check_end_time" class="me-2 my-3"/>
                  <label class="form-label  mb-0">{{ this.$t("timesheet.working-shift.form.check_end_time") }}</label>
                </div>
              </BCol>
            <template v-if="item.check_end_time">
              <BCol  xl="2" lg="3">
                <BRow class="align-items-center mb-3">
                  <BCol  xl="2">
                    <label :for="check_end_time_from" class="m-0">{{ this.$t('timesheet.working-shift.form.check_end_time_from') }}</label>
                  </BCol>
                  <BCol xl="10">
                    <BFormInput id="check_end_time_from" type="time" name="check_end_time_from" v-model="item.check_end_time_from" />
                  </BCol>
                </BRow>
              </BCol>

              <BCol  xl="2" lg="3">
                <BRow class="align-items-center mb-3">
                  <BCol  xl="2">
                    <label :for="check_end_time_to" class="m-0">{{ this.$t('timesheet.working-shift.form.check_end_time_to') }}</label>
                  </BCol>
                  <BCol xl="10">
                    <BFormInput id="check_end_time_to" type="time" name="check_end_time_to" v-model="item.check_end_time_to" />
                  </BCol>
                </BRow>
              </BCol>
            </template>

            </BRow>
          </BCol>
        </BRow>
        <!--end:item.check_end_start_time-->

<!--start:item.break_time-->
       <BRow class="mb-3">
         <Bcol>
           <div class="d-flex align-items-center">
             <InputSwitch v-model="item.is_break_time" class="me-2"/>
             <label class="form-label  mb-0">{{ this.$t("timesheet.working-shift.form.is_break_time") }}</label>
           </div>
         </Bcol>
       </BRow>
      <template v-if="item.is_break_time">
        <!--start:item.break_time-->
        <BRow class="mb-3">
          <BCol cols="12" xl="12">
            <BRow class="align-items-center">
              <BCol   xl="2">
                <label :for="start_break_time" class="m-0">{{ this.$t('timesheet.working-shift.form.start_break_time') }} (<span class="text-danger">*</span>)</label>
              </BCol>
              <BCol xl="2">
                <BFormInput id="start_break_time" type="time" name="start_break_time" v-model="item.start_break_time"/>
              </BCol>

              <BCol  xl="2">
                <div class="d-flex align-items-center mb-3">
                  <InputSwitch v-model="item.check_break_time_out" class="me-2"/>
                  <label class="form-label  mb-0">{{ this.$t("timesheet.working-shift.form.check_break_time_out") }}</label>
                </div>
              </BCol>
              <template v-if="item.check_break_time_out  ||  item.check_break_time_in">
                <BCol xl="3">
                  <BRow class="align-items-center mb-3">
                    <BCol  xl="3">
                      <label :for="break_time_out_from" class="m-0">{{ this.$t('timesheet.working-shift.form.break_time_out_from') }} (<span class="text-danger">*</span>)</label>
                    </BCol>
                    <BCol xl="9">
                      <BFormInput id="break_time_out_from" type="time" name="break_time_out_from" v-model="item.break_time_out_from" />
                    </BCol>
                  </BRow>
                </BCol>
              </template>

            </BRow>
          </BCol>
        </BRow>
        <!--end:item.check_end_start_time-->

        <!--start:item.end_break_time-->
        <BRow class="mb-3">
          <BCol cols="12" xl="12">
            <BRow class="align-items-center mb-3">
              <BCol   xl="2">
                <label :for="end_break_time" class="m-0">{{ this.$t('timesheet.working-shift.form.end_break_time') }}  (<span class="text-danger">*</span>)</label>
              </BCol>
              <BCol xl="2">
                <BFormInput id="end_break_time" type="time" name="end_break_time" v-model="item.end_break_time"/>
              </BCol>

              <BCol  xl="2">
                <div class="d-flex align-items-center">
                  <InputSwitch v-model="item.check_break_time_in" class="me-2"/>
                  <label class="form-label  mb-0">{{ this.$t("timesheet.working-shift.form.check_break_time_in") }} </label>
                </div>
              </BCol>
              <template v-if="item.check_break_time_out  ||  item.check_break_time_in">
                <BCol xl="3">
                  <BRow class="align-items-center">
                    <BCol  xl="3">
                      <label :for="break_time_in_to" class="m-0">{{ this.$t('timesheet.working-shift.form.break_time_in_to') }} (<span class="text-danger">*</span>)</label>
                    </BCol>
                    <BCol xl="9">
                      <BFormInput id="break_time_in_to" type="time" name="break_time_in_to" v-model="item.break_time_in_to" />
                    </BCol>
                  </BRow>
                </BCol>
              </template>

            </BRow>
          </BCol>
        </BRow>
        <!--end:item.check_end_start_time-->
        </template>

        <BRow class="my-4">
            <BCol>
              <strong class="text-uppercase  text-danger-emphasis">{{ this.$t("timesheet.working-shift.calculation") }}</strong>
            </BCol>
        </BRow>

        <BRow class="mb-3">
          <BCol xl="12">
            <BRow class="mb-3 justify-content-event">
              <BCol cols="12" xl="12">
                <BRow class="align-items-center mb-3">
                  <BCol  xl="2">
                    <label :for="working_hour" class="m-0">{{ this.$t('timesheet.working-shift.form.working_hour') }}</label>
                  </BCol>
                  <BCol xl="5">
                    <BFormInput id="working_hour" type="text" name="working_hour" v-model="item.working_hour"/>
                  </BCol>
                </BRow>
              </BCol>

              <BCol cols="12" xl="12">
                <BRow class="align-items-center mb-3">
                  <BCol  xl="2">
                    <label :for="working_day" class="m-0">{{ this.$t('timesheet.working-shift.form.working_day') }}</label>
                  </BCol>
                  <BCol xl="5">
                    <BFormInput id="working_day" type="text" name="working_day" v-model="item.working_day"/>
                  </BCol>
                </BRow>
              </BCol>
            </BRow>
          </BCol>
        </BRow>

        <BRow class="my-4">
          <BCol>
            <strong class="text-uppercase text-danger-emphasis">{{ this.$t("timesheet.working-shift.calculation-rate") }}</strong>
          </BCol>
        </BRow>


        <BRow class="mb-3">
          <BCol xl="12">
            <BRow class="mb-3 justify-content-event">
              <BCol cols="12" xl="12">
                <BRow class="align-items-center mb-3">
                  <BCol  xl="2">
                    <label :for="working_rate_weekday" class="m-0">{{ this.$t('timesheet.working-shift.form.working_rate_weekday') }}</label>
                  </BCol>
                  <BCol xl="5">
                    <BFormInput id="working_rate_weekday" type="text" name="working_rate_weekday" v-model="item.working_rate_weekday"/>
                  </BCol>
                </BRow>
              </BCol>

              <BCol cols="12" xl="12">
                <BRow class="align-items-center mb-3">
                  <BCol  xl="2">
                    <label :for="working_rate_weekend" class="m-0">{{ this.$t('timesheet.working-shift.form.working_rate_weekend') }}</label>
                  </BCol>
                  <BCol xl="5">
                    <BFormInput id="working_rate_weekend" type="text" name="working_rate_weekend" v-model="item.working_rate_weekend"/>
                  </BCol>
                </BRow>
              </BCol>

              <BCol cols="12" xl="12">
                <BRow class="align-items-center">
                  <BCol  xl="2">
                    <label :for="working_rate_holiday" class="m-0">{{ this.$t('timesheet.working-shift.form.working_rate_holiday') }}</label>
                  </BCol>
                  <BCol xl="5">
                    <BFormInput id="working_rate_holiday" type="text" name="working_rate_holiday" v-model="item.working_rate_holiday"/>
                  </BCol>
                </BRow>
              </BCol>


            </BRow>
          </BCol>
        </BRow>


        <BRow class="mb-3">
          <Bcol>
            <div class="d-flex align-items-center">
              <InputSwitch v-model="item.is_show_without_check_in" class="me-2"/>
              <label class="form-label  mb-0">{{ this.$t("timesheet.working-shift.form.is_show_without_check_in") }}</label>
            </div>
          </Bcol>
        </BRow>
        <template v-if="item.is_show_without_check_in">
          <BRow class="mb-3">
            <BCol xl="12">
              <BRow class="mb-3 justify-content-event">
                <BCol cols="12" xl="12">
                  <BRow class="align-items-center mb-3">
                    <BCol  xl="2">
                      <label :for="working_hour_without_check_in" class="m-0">{{ this.$t('timesheet.working-shift.form.working_hour_without_check_in') }}</label>
                    </BCol>
                    <BCol xl="5">
                      <BFormInput id="working_hour_without_check_in" type="text" name="working_hour_without_check_in" v-model="item.working_hour_without_check_in"/>
                    </BCol>
                  </BRow>
                </BCol>

                <BCol cols="12" xl="12">
                  <BRow class="align-items-center">
                    <BCol  xl="2">
                      <label :for="working_day_without_check_in" class="m-0">{{ this.$t('timesheet.working-shift.form.working_day_without_check_in') }}</label>
                    </BCol>
                    <BCol xl="5">
                      <BFormInput id="working_day_without_check_in" type="text" name="working_day_without_check_in" v-model="item.working_day_without_check_in"/>
                    </BCol>
                  </BRow>
                </BCol>
              </BRow>
            </BCol>
          </BRow>
        </template>



        <BRow class="mb-3">
          <Bcol>
            <div class="d-flex align-items-center">
              <InputSwitch v-model="item.is_show_without_check_out" class="me-2"/>
              <label class="form-label  mb-0">{{ this.$t("timesheet.working-shift.form.is_show_without_check_out") }}</label>
            </div>
          </Bcol>
        </BRow>
        <template v-if="item.is_show_without_check_out">
          <BRow class="mb-3">
            <BCol xl="12">
              <BRow class="mb-3 justify-content-event">
                <BCol cols="12" xl="12">
                  <BRow class="align-items-center mb-3">
                    <BCol  xl="2">
                      <label :for="working_hour_without_check_out" class="m-0">{{ this.$t('timesheet.working-shift.form.working_hour_without_check_out') }}</label>
                    </BCol>
                    <BCol xl="5">
                      <BFormInput id="working_hour_without_check_out" type="text" name="working_hour_without_check_out" v-model="item.working_hour_without_check_out"/>
                    </BCol>
                  </BRow>
                </BCol>

                <BCol cols="12" xl="12">
                  <BRow class="align-items-center">
                    <BCol  xl="2">
                      <label :for="working_day_without_check_out" class="m-0">{{ this.$t('timesheet.working-shift.form.working_day_without_check_out') }}</label>
                    </BCol>
                    <BCol xl="5">
                      <BFormInput id="working_day_without_check_out" type="text" name="working_day_without_check_out" v-model="item.working_day_without_check_out"/>
                    </BCol>
                  </BRow>
                </BCol>
              </BRow>
            </BCol>
          </BRow>
        </template>



        <BRow class="mb-3">
          <Bcol>
            <div class="d-flex align-items-center">
              <InputSwitch v-model="item.is_allow_late_in_early_out" class="me-2"/>
              <label class="form-label  mb-0">{{ this.$t("timesheet.working-shift.form.is_allow_late_in_early_out") }}</label>
            </div>
          </Bcol>
        </BRow>
        <template v-if="item.is_allow_late_in_early_out">
          <BRow class="mb-3">
            <BCol xl="12" md="12">
              <BRow class="mb-3 justify-content-event">
                <BCol cols="12" xl="12" md="12">
                  <BRow class="align-items-center mb-3">
                    <BCol  xl="2" md="3">
                      <label :for="late_in_time" class="m-0">{{ this.$t('timesheet.working-shift.form.late_in_time') }}</label>
                    </BCol>
                    <BCol xl="5" md="7">
                      <BFormInput id="late_in_time" type="number" name="late_in_time" v-model="item.late_in_time"/>
                    </BCol>
                  </BRow>
                </BCol>

                <BCol cols="12" xl="12" md="12" >
                  <BRow class="align-items-center">
                    <BCol  xl="2" md="3">
                      <label :for="early_out_time" class="m-0">{{ this.$t('timesheet.working-shift.form.early_out_time') }}</label>
                    </BCol>
                    <BCol xl="5" md="7">
                      <BFormInput id="early_out_time" type="number" name="early_out_time" v-model="item.early_out_time"/>
                    </BCol>
                  </BRow>
                </BCol>
              </BRow>
            </BCol>
          </BRow>
        </template>

        <BCardFooter>
          <div class="d-flex justify-content-end">
            <BButton :loading="isLoading" type="submit" class="btn btn-success" @click="onUpdateWorkingShift">{{ this.$t("capnhat") }}</BButton>
          </div>

        </BCardFooter>
      </BCard>
    </BForm>
  </Layout>
</template>

<script>
import PageHeader from "@/components/page-header.vue";
import Layout from "@/layouts/main.vue";
import WorkingShiftEntity from "@/views/timesheet/entities/WorkingShiftEntity";
import InputSwitch from "primevue/inputswitch";
import {useVuelidate} from "@vuelidate/core";
import {helpers, required} from "@vuelidate/validators";
export default {
  props: {
    headerTitle: String,
    pageTitle: String,
  },
  components: {
    Layout,
    PageHeader,
    InputSwitch
  },
  watch: WorkingShiftEntity.watch,
  data(){
    return {
      item: {}
    }
  },
  beforeMount() {
    WorkingShiftEntity.getService().getWorkingShift(this.$route.params.id).then((response) =>{
      this.item = response.data.data
      this.item.id = response.data.data.id;
    });
  },
  methods: {
    async  onUpdateWorkingShift(){
      let _this = this;
      return  _this.validateForm().then(()=>{
        _this.onSubmit().then((response) => {
            if(response.data.success){
              alert("success");
            }
        });
      }).catch((err)=>{
        document.getElementById(err.$property).classList.add("focusError");
        document.getElementById(err.$property).focus();
        this.$root.showToast(err.$message, { type: "error"})
          return;
      });
    },
    async onSubmit(){
      return await WorkingShiftEntity.createOrUpdate(this.item);
    },
    async validateForm() {
      //how to remove all elements with class named focusError ???

      let errosFocus = document.getElementsByClassName("focusError");
      if(errosFocus.length > 0){
        //to remove focusErrors
      }
      let _this = this;
      const result = await this.v$.$validate();
      if (!result) {
         _this.v$.$errors.forEach(err => {
             throw err;
        });
      }
    },
  },
  setup() {
    return {
      v$: useVuelidate()
    }
  },
  validations () {
    let validation =  {
      item:{
        name: {
          required:helpers.withMessage(this.$t('timesheet.working-shift.errors.notEmptyName'), required)
        },
        code: {
          required:helpers.withMessage(this.$t('timesheet.working-shift.errors.notEmptyCode'), required)
        },
        start_time: {
          required:helpers.withMessage(this.$t('timesheet.working-shift.errors.notEmptyStartTime'), required)
        },
        end_time: {
          required:helpers.withMessage(this.$t('timesheet.working-shift.errors.notEmpty'), required)
        },
      }
    };
    if(this.item.is_break_time){
      validation.item['start_break_time'] =  {required:helpers.withMessage(this.$t('timesheet.working-shift.errors.notEmpty_start_break_time'), required)};
      validation.item['end_break_time'] =  {required:helpers.withMessage(this.$t('timesheet.working-shift.errors.notEmpty_end_break_time'), required)};

      if(this.item.check_break_time_out){
        validation.item['break_time_out_from'] =  {required:helpers.withMessage(this.$t('timesheet.working-shift.errors.notEmpty'), required)};
      }

      if(this.item.check_break_time_in){
        validation.item['break_time_in_to'] =  {required:helpers.withMessage(this.$t('timesheet.working-shift.errors.notEmpty'), required)};
      }
    }
    return validation;
  },
}
</script>