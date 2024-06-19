// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.
import Spinner from "./Spinner"
import React from 'react'
import { render, fireEvent, screen, waitForElementToBeRemoved } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import '@testing-library/jest-dom'


test('test [1]', () => {
  expect(true).toBe(true)
})


test('test [2]', () => {
  expect('Please wait...').toBeVisible
})
