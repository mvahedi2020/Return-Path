import {defineConfig} from '@playwright/test'
export default defineConfig({testDir:'./tests',workers:1,use:{baseURL:'http://127.0.0.1:4192/Return-Path/',browserName:'chromium',viewport:{width:1280,height:633},trace:'retain-on-failure'},webServer:{command:'npm run preview',url:'http://127.0.0.1:4192/Return-Path/',reuseExistingServer:false},reporter:'list'})
