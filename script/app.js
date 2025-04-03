export class App {
  #users;
  #apiUrl;
  #containerEl;
  #searchEl;

  constructor(url, containerEl, searchEl) {
    this.#apiUrl = url;
    this.#containerEl = containerEl;
    this.#searchEl = searchEl;
  }

  // Went with initializer approach as constructor can't be async
  // I went with strong encapsulation, the initializer is my only public method
  async init() {
    // Getting users from API once
    try {
      await this.#fetchUsers();
      // Displaying all users by default
      this.#displayUsers();

      // Adding event listeners
      this.#searchEl.addEventListener('keyup', this.#userSearch.bind(this));
      this.#containerEl.addEventListener('click', this.#displayMoreInfo);
    } catch (err) {
      this.#displayError(err);
    }
  }

  async #fetchUsers() {
    const response = await fetch(this.#apiUrl);
    // error is thrown in this method, and caught in initialize which calls fetchUsers
    if (!response.ok)
      throw new Error(`Problem fetching users (HTTP ${response.status})`);
    const data = await response.json();
    // unpacking data with ... into a new array, very clean
    this.#users = [...data];
  }

  #displayUsers(userArr) {
    this.#containerEl.innerHTML = '';
    const users = userArr || this.#users;
    users.forEach(user => {
      const html = `
      <article class="user-card">
        <h2 class="font-bold">${user.name}</h2>
        <p>Username: ${user.username}</p>
        <p>Email: ${user.email}</p>
        <div class="mt-2 invisible">
          <p>City: ${user.address.city}</p>
          <p>Phone: ${user.phone}</p>
          <p>Company: ${user.company.name}</p>
        </div>
      </article>
    `;
      this.#containerEl.insertAdjacentHTML('beforeend', html);
    });
  }

  // applying search term from search input field before displaying users
  #userSearch() {
    if (this.#searchEl.value) {
      const searchMatch = userProp =>
        userProp.toLowerCase().includes(this.#searchEl.value.toLowerCase());
      const filteredUsers = this.#users.filter(
        user =>
          searchMatch(user.name) ||
          searchMatch(user.username) ||
          searchMatch(user.email),
      );
      this.#displayUsers(filteredUsers);
    } else {
      this.#displayUsers();
    }
  }

  #displayMoreInfo(e) {
    const userCard = e.target.closest('.user-card');
    if (userCard) {
      userCard.querySelector('div').classList.toggle('invisible');
    }
  }

  #displayError(err) {
    console.error(err);
    const errorHTML = `
    <div class="error-msg">
      <h2 class="text-2xl">ERROR</h2>
      <p>Error when fetching users: ${err.message}</p>
    </div>
  `;
    document.body.insertAdjacentHTML('beforeend', errorHTML);
  }
}
