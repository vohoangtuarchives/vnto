import { mapState, mapGetters, mapActions } from 'vuex'

export const authComputed = {
  ...mapState('auth', {
    currentUser: (state) => state.currentUser,
  }),
  ...mapGetters('auth', ['loggedIn']),
}



export const authMethods = mapActions('auth', ['logIn', 'logOut', 'register', 'resetPassword'])


// export const authFackMethods = mapActions('authfack', ['login', 'registeruser', 'logout'])

export const notificationMethods = mapActions('notification', ['success', 'error', 'clear'])

// export const todoComputed = {
//   ...mapState('todo', {
//     todos: (state) => state.todos
//   })
// }
// export const todoMethods = mapActions('todo', ['fetchTodos'])