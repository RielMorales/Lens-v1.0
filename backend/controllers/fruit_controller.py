from fastapi import APIRouter
from models.fruit import Fruit, Fruits
from database.memory import memory_db

router = APIRouter()

@router.get("/fruits", response_model=Fruits)
def get_fruits():
    return Fruits(fruits=memory_db["fruits"])

@router.post("/fruits", response_model=Fruit)
def add_fruit(fruit: Fruit):
    memory_db["fruits"].append(fruit)
    return fruit
