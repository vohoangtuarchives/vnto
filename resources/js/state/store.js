import Vuex from 'vuex';

const modules = import.meta.glob('./modules/*.js', {
  eager: true
});

const storeModules = {};

for (const key in modules) {
  const matched = key.match(/([A-Za-z0-9-_]+)\./i);
  if (matched && matched.length > 1) {
    storeModules[matched[1]] = modules[key].default;
  }
}

console.log(storeModules);
const store = new Vuex.Store({
  modules: storeModules,
});

store.dispatch('data/initializeData');
store.dispatch('user/getUserList');
export default store;