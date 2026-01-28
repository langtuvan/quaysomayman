import { gql } from '@apollo/client'

export const GET_WHEEL_FORTUNES_BY_USER = gql`
  query wheelFortunes {
    wheelFortunes {
      id
      type
      title
    
    }
  }
`
export const GET_RANDOM_FORTUNES_BY_USER = gql`
  query randomFortunes {
    randomFortunes {
      id
      type
      title
     
    }
  }
`
export const GET_FORTUNE = gql`
  query fortune($id: String!) {
    fortune(id: $id) {
      id
      type
      title
      description
      persons {
        id
        manv
        name
      }
      prizes {
        id
        key
        name
        qty
      }
      winners {
        id
        manv
        name
        key
        prizeId
        prize
      }
      createdBy {
        id
      }
    }
  }
`

// mutation
export const SPIN_WHEEL = gql`
  mutation spinWheel($id: String!, $input: SpinWheelInput!) {
    winner(id: $id, input: $input) {
      id
      manv
      name
      key
      prizeId
      prize
    }
  }
`

export const SPIN_RANDOM = gql`
  mutation randomWinner($id: String!, $input: RandomInput!) {
    randomWinner(id: $id, input: $input) {
      id
      manv
      name
      key
      prizeId
      prize
    }
  }
`

export const GET_FORTUNE_PRIZES = gql`
  query GetFortunePrizes($id: String!) {
    guestFortune(id: $id) {
      id
      type
      title
      description
      prizes {
        id
        key
        name
        qty
      }
      createdBy {
        id
      }
    }
  }
`

export const CREATE_FORTUNE = gql`
  mutation createFortune($input: FortuneDto!) {
    createFortune(input: $input) {
      id
      type
      title
  
    }
  }
`

export const UPDATE_FORTUNE = gql`
  mutation updateFortune($id: String!, $input: UpdateFortuneDto!) {
    updateFortune(id: $id, input: $input) {
      id
      type
      title
      description
      persons {
        id
        manv
        name
      }
      prizes {
        id
        key
        name
        qty
      }
      winners {
        id
        manv
        name
        key
        prizeId
        prize
      }
      createdBy {
        id
      }
    }
  }
`

export const DELETE_FORTUNE = gql`
  mutation deleteFortune($id: String!) {
    deleteFortune(id: $id) {
      id
      type
      title
   
    }
  }
`
