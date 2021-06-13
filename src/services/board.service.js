import { httpService } from './http.service'
import { storageService } from './async-storage.service'
import { utilService } from './util.service'
import { userService } from './user.service'
import { board } from '../data/board.js'

export const boardService = {
  add,
  query,
  remove,
  getById,
  update,
  getEmptyGroup,
  getEmptyTask,
  getEmptyCheckList,
  getEmptyTodo
}

const KEY = 'board'

function query() {
  return httpService.get(`board`)
}

function remove(boardId) {
  return httpService.delete(`board/${boardId}`)
}

function update(board) {
  return httpService.put(`board/${board._id}`, board)
}
async function add(board) {
  const addedBoard = await httpService.post(`board`, board)
  return addedBoard
}

function getById(boardId) {
  return httpService.get(`board/${boardId}`)
}

function getEmptyGroup() {
  return {}
}

function getEmptyTask() {
  return {}
}

function getEmptyCheckList() {
  return {
    id: utilService.makeId(),
    title: '',
    todos: []
  }
}

function getEmptyTodo() {
  return {
    "id": utilService.makeId(),
    "title": '',
    "isDone": false
  }
}