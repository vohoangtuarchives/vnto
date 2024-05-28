export default{
    parseFilter(filterQuery) {
        if (!filterQuery) return {}; // Trả về đối tượng filter trống nếu không có filterQuery
      
        // Tách các cặp key-value từ query string
        const filterPairs = filterQuery.split(','); // Giả sử filterQuery có dạng 'keyword=value1,value2&category=value3,value4'
        
        // Tạo một đối tượng filter từ các cặp key-value
        const filter = {};
        filterPairs.forEach(pair => {
          const [key, ...values] = pair.split('='); // Tách key và values từ mỗi cặp key-value
          filter[key] = values; // Lưu giá trị vào đối tượng filter
        });
      
        return filter;
      }
}