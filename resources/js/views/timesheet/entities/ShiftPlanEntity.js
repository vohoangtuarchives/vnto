const RepeatType= {
    DAY: 1,
    WEEK: 2,
    MONTH:3
};
const ShiftPlanEntity = {
    item: {
        name: "",
        repeat_type: RepeatType.DAY,
        repeat_config:{},
        employees: [],
        working_shift_ids: [],
        to_date: "",
        from_date: ""
    }
};

export default {ShiftPlanEntity, RepeatType};