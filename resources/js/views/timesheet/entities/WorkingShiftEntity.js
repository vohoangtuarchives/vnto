import Timesheet from "@/services/timesheet";
import {helpers, required} from "@vuelidate/validators";


const WorkingShiftEntity = {
    item: {
        code:"",
        name:"",
        start_time:"",
        end_time:"",
        start_time_in_from:"",
        start_time_in_to:"",
        end_time_in_from:"",
        end_time_in_to:"",
        start_break_time:"",
        end_break_time:"",
        break_time_out_from:"",
        break_time_in_to:"",
        late_in_time: 5, //in minutes
        early_out_time:5, //in minutes
        working_hour: 8.5,
        working_day: 1,
        working_rate_weekday:  1,
        working_rate_weekend: 2,
        working_rate_holiday: 3,
        working_hour_without_check_in:0,
        working_day_without_check_in:0,
        working_hour_without_check_out:0,
        working_day_without_check_out:0,
        working_shift_eat_calculate:"",
        over_time_first_time_check:"",
        over_time_after_time_check:"",
        template_code:"",
        late_in_early_out_penalty_data:"",
        check_start_time: false,
        check_end_time: false,
        check_break_time_out: false,
        check_break_time_in: false,
        late_in_early_out_penalty:"",
        is_break_time: false,
        is_allow_late_in_early_out: false,
        is_late_in_early_out_penalty: false,
        is_show_without_check_in: false,
        is_show_without_check_out: false,
        is_working_shift_eat: false,
        is_over_time: false,
        is_over_time_first_working_shift: false,
        is_over_time_after_working_shift: false,
        is_over_time_break_shift: false,
        is_over_time_first_shift: false,
        is_over_time_after_shift: false,
        is_template: false,
        is_get_full_break_time: false,
        is_fix_coefficient: false,
        is_total_working_by_eat: false,
        is_late_in: false,
        is_late_in_penalty: false,
        is_early_out_penalty: false,
        is_detached_working: false,   },
    service: Timesheet,
    getService(){
      return this.service;
    },
    validations ($t) {
        let validation =  {
            item:{
                name: {
                    required:helpers.withMessage($t('timesheet.working-shift.errors.notEmptyName'), required)
                },
                code: {
                    required:helpers.withMessage($t('timesheet.working-shift.errors.notEmptyCode'), required)
                },
                start_time: {
                    required:helpers.withMessage($t('timesheet.working-shift.errors.notEmptyStartTime'), required)
                },
                end_time: {
                    required:helpers.withMessage($t('timesheet.working-shift.errors.notEmpty'), required)
                },
            }
        };
        if(this.item.is_break_time){
            validation.item['start_break_time'] =  {required:helpers.withMessage($t('timesheet.working-shift.errors.notEmpty_start_break_time'), required)};
            validation.item['end_break_time'] =  {required:helpers.withMessage($t('timesheet.working-shift.errors.notEmpty_end_break_time'), required)};

            if(this.item.check_break_time_out){
                validation.item['break_time_out_from'] =  {required:helpers.withMessage($t('timesheet.working-shift.errors.notEmpty'), required)};
            }

            if(this.item.check_break_time_in){
                validation.item['break_time_in_to'] =  {required:helpers.withMessage($t('timesheet.working-shift.errors.notEmpty'), required)};
            }
        }
        return validation;
    },

    watch: {
        "item.check_break_time_out": {
            handler(value){
                this.item.check_break_time_in = value
            },
            deep: true
        },
        "item.check_break_time_in": {
            handler(value){
                this.item.check_break_time_out = value
            },
            deep: true
        },
    },

    async createOrUpdate(item) {
            return await this.service.updateOrCreateWorkingShift(item);
    },

};
export default WorkingShiftEntity;