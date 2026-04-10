#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype,
    Env, String, Address
};

#[contracttype]
#[derive(Clone)]
pub struct Book {
    pub title: String,
    pub author: String,
    pub owner: Address,
}

#[contracttype]
pub enum DataKey {
    Book(u64),
}

#[contract]
pub struct BookNFTContract;

#[contractimpl]
impl BookNFTContract {

    // Mint a Book NFT
    pub fn mint(
        env: Env,
        id: u64,
        title: String,
        author: String,
        owner: Address
    ) {
        let key = DataKey::Book(id);

        if env.storage().instance().has(&key) {
            panic!("Book already exists");
        }

        owner.require_auth();

        let book = Book { title, author, owner };
        env.storage().instance().set(&key, &book);
    }

    // Get Book
    pub fn get_book(env: Env, id: u64) -> Book {
        let key = DataKey::Book(id);

        env.storage()
            .instance()
            .get(&key)
            .unwrap_or_else(|| panic!("Book not found"))
    }

    // Transfer ownership
    pub fn transfer(env: Env, id: u64, new_owner: Address) {
        let key = DataKey::Book(id);

        let mut book: Book = env.storage()
            .instance()
            .get(&key)
            .unwrap_or_else(|| panic!("Book not found"));

        book.owner.require_auth();

        book.owner = new_owner;

        env.storage().instance().set(&key, &book);
    }
}