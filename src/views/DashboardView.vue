<script setup lang="ts">
import { TransactionType, amountToString, useUserDataStore, getNameOfTransactionType } from "../stores/UserData";
import InfoBox from "../components/InfoBox.vue";
import LineChart from "../components/LineChart.vue";
import PieChart from "../components/PieChart.vue";
import dayjs from "dayjs";
import { computed, type Ref } from "vue";
import type { ChartData } from "chart.js";

const userDataStore = useUserDataStore();


// Balance info
const currentBalance: Ref<number> = computed(() => {
  return userDataStore.currentBalance;
});
const currentBalanceAnd30DaysAgoDelta: Ref<number> = computed(() => {
  return (userDataStore.currentBalance - userDataStore.balance(dayjs().subtract(30, 'days').unix()));
});


// Cashflow info
const last30DaysCashflow: Ref<number> = computed(() => {
  return userDataStore.summarizedCashflow(dayjs().subtract(30, 'days').unix(), dayjs().unix());
});
const last30DaysCashflowAndPrevious30DaysDelta: Ref<number> = computed(() => {
  return userDataStore.summarizedCashflow(dayjs().subtract(30, 'days').unix(), dayjs().unix()) -
          userDataStore.summarizedCashflow(dayjs().subtract(60, 'days').unix(), dayjs().subtract(30, 'days').unix());
});


// Expenditure info
const last30DaysExpenditures: Ref<number> = computed(() => {
  return userDataStore.summarizedExpenditures(dayjs().subtract(30, 'days').unix(), dayjs().unix());
});
const last30DaysExpendituresAndPrevious30DaysDelta: Ref<number> = computed(() => {
  return userDataStore.summarizedExpenditures(dayjs().subtract(30, 'days').unix(), dayjs().unix()) -
          userDataStore.summarizedExpenditures(dayjs().subtract(60, 'days').unix(), dayjs().subtract(30, 'days').unix());
});


// Earning info
const last30DaysEarnings: Ref<number> = computed(() => {
  return userDataStore.summarizedEarnings(dayjs().subtract(30, 'days').unix(), dayjs().unix());
});
const last30DaysEarningsAndPrevious30DaysDelta: Ref<number> = computed(() => {
  return userDataStore.summarizedEarnings(dayjs().subtract(30, 'days').unix(), dayjs().unix()) -
          userDataStore.summarizedEarnings(dayjs().subtract(60, 'days').unix(), dayjs().subtract(30, 'days').unix());
});


const cashAssetDevelopmentChartData = computed(() => {
  let chartData: ChartData<'line'> = {labels: [], datasets: [{data: []}]};

  for(let i = 0; i < 53; i++)
  {
    chartData.labels?.push(
      dayjs().subtract(i, 'weeks').format()
    );
    chartData.datasets[0].data.push(
      (userDataStore.balance(dayjs().subtract(i, 'weeks').unix()) / 100)
    );
  }

  return chartData;
});


const earningsByGroupChartData = computed(() => {
  let chartData: ChartData<'pie'> = { labels: [], datasets: [ { data: [] } ] };

  Object.values(TransactionType).forEach((type) => {
    chartData.labels?.push(getNameOfTransactionType(type));
    chartData.datasets[0].data.push((userDataStore.summarizedEarnings(dayjs().subtract(12, 'months').unix(), dayjs().unix(), type) / 100))
  });

  return chartData;
});


const expendituresByGroupChartData = computed(() => {
  let chartData: ChartData<'pie'> = { labels: [], datasets: [ { data: [] } ] };

  Object.values(TransactionType).forEach((type) => {
    chartData.labels?.push(getNameOfTransactionType(type));
    chartData.datasets[0].data.push((userDataStore.summarizedExpenditures(dayjs().subtract(12, 'months').unix(), dayjs().unix(), type) / 100))
  });

  return chartData;
});

const expendituresVsEarningsChartData = computed(() => {
  let chartData: ChartData<'line'> = {labels: [], datasets: [{data: [], label: "Expenditures"}, {data: [], label: "Earnings", borderColor: "#8CBEB2A0"}]};

  for(let i = 0; i < 12; i++)
  {
    chartData.labels?.push(
      dayjs().subtract(i, 'weeks').format()
    );
    console.log("Start time: " + dayjs().subtract((i + 1), 'months').unix());
    console.log("End time: " + dayjs().subtract((i), 'months').unix());
    chartData.datasets[0].data.push(
      (userDataStore.summarizedExpenditures(dayjs().subtract((i + 1), 'months').unix(), dayjs().subtract(i, 'months').unix()) / 100)
    );
    chartData.datasets[1].data.push(
      (userDataStore.summarizedEarnings(dayjs().subtract((i + 1), 'months').unix(), dayjs().subtract(i, 'months').unix()) / 100)
    );
  }

  return chartData;
});
</script>

<template>
  <el-container>
    <el-header>
      <h1>Dashboard</h1>
    </el-header>
    <el-main>
      <div class="custom-grid">
        <InfoBox>
          <template v-slot:title>
            Current cash assets
          </template>
          <span class="big-text">{{ amountToString(currentBalance) }}</span>
          <br/>
          <span class="normal-text">{{ amountToString(currentBalanceAnd30DaysAgoDelta, true) }}</span>
          <br />
          <span class="small-text">over last 30 days</span>
        </InfoBox>

        <InfoBox>
          <template v-slot:title>
            Cash flow
          </template>
          <template v-slot:subtitle>
            Last 30 days
          </template>
          <span class="big-text">{{ amountToString(last30DaysCashflow) }}</span>
          <br/>
          <span class="normal-text">{{ amountToString(last30DaysCashflowAndPrevious30DaysDelta, true) }}</span>
          <br />
          <span class="small-text">compared to previous 30 days</span>
        </InfoBox>

        <InfoBox>
          <template v-slot:title>
            Earnings
          </template>
          <template v-slot:subtitle>
            Last 30 days
          </template>
          <span class="big-text">{{ amountToString(last30DaysEarnings) }}</span>
          <br/>
          <span class="normal-text">{{ amountToString(last30DaysEarningsAndPrevious30DaysDelta, true) }}</span>
          <br />
          <span class="small-text">compared to previous 30 days</span>
        </InfoBox>

        <InfoBox>
          <template v-slot:title>
            Expenditures
          </template>
          <template v-slot:subtitle>
            Last 30 days
          </template>
          <span class="big-text">{{ amountToString(last30DaysExpenditures) }}</span>
          <br/>
          <span class="normal-text">{{ amountToString(last30DaysExpendituresAndPrevious30DaysDelta, true) }}</span>
          <br />
          <span class="small-text">compared to previous 30 days</span>
        </InfoBox>

        <InfoBox full-width>
          <template v-slot:title>
            Cash asset development
          </template>
          <template v-slot:subtitle>
            Last 12 months
          </template>
          <LineChart css-classes="asset-development-chart" :chart-options="
            {
              plugins: {
                legend: {
                  display: false
                }
              },
              tension: 0.5,
              borderColor: 'rgb(200, 120, 140)',
              borderWidth: 3,
              pointRadius: 2,
              animation: true,
              scales: {
                y: {
                  position: 'right',
                  grid: {
                    borderColor: 'rgb(123, 123, 123, 0.2)',
                    color: 'rgb(123, 123, 123, 0.2)',
                    drawBorder: true
                  }
                },
                x: {
                  type: 'time',
                  time: {
                      unit: 'month',
                      tooltipFormat: 'MMMM'
                  },
                  grid: {
                    display: false,
                    borderColor: 'rgb(123, 123, 123, 0.2)'
                  }
                }
              }
            }"
            :chart-data="cashAssetDevelopmentChartData"
          />
        </InfoBox>

        <InfoBox content-align="center">
          <template v-slot:title>
            Earnings by group
          </template>
          <template v-slot:subtitle>
            last 12 months
          </template>
          <PieChart css-classes="group-pie-chart" :chart-options="
            {
              plugins: {
                legend: {
                  display: true,
                  position: 'right'
                }
              },
              animation: true,
              borderWidth: 0,
              offset: 0,
              backgroundColor: ['#5C4B51A0', '#8CBEB2A0', '#F3B562A0', '#F06060A0', '#F2EBBFA0']
            }"
            :chart-data="earningsByGroupChartData"
           />
        </InfoBox>

        <InfoBox content-align="center">
          <template   v-slot:title>
            Expenditures by group
          </template>
          <template v-slot:subtitle>
            last 12 months
          </template>
          <PieChart css-classes="group-pie-chart" :chart-options="
            {
              plugins: {
                legend: {
                  display: true,
                  position: 'right'
                }
              },
              animation: true,
              borderWidth: 0,
              offset: 0,
              backgroundColor: ['#5C4B51A0', '#8CBEB2A0', '#F3B562A0', '#F06060A0', '#F2EBBFA0']
            }"
            :chart-data="expendituresByGroupChartData"
          />
        </InfoBox>

        <InfoBox full-width>
          <template v-slot:title>
            Expenditures vs. Earnings
          </template>
          <template v-slot:subtitle>
            Last 12 months
          </template>
          <LineChart css-classes="earnings-expenditures-comparison-chart" :chart-options="
            {
              plugins: {
                legend: {
                  display: true
                }
              },
              tension: 0.5,
              borderColor: 'rgb(200, 120, 140)',
              borderWidth: 3,
              pointRadius: 2,
              animation: true,
              scales: {
                y: {
                  position: 'right',
                  grid: {
                    borderColor: 'rgb(123, 123, 123, 0.2)',
                    color: 'rgb(123, 123, 123, 0.2)',
                    drawBorder: true
                  }
                },
                x: {
                  type: 'time',
                  time: {
                      unit: 'month',
                      tooltipFormat: 'MMMM'
                  },
                  grid: {
                    display: false,
                    borderColor: 'rgb(123, 123, 123, 0.2)'
                  }
                }
              }
            }"
            :chart-data="expendituresVsEarningsChartData"
          />
        </InfoBox>
      </div>
    </el-main>
  </el-container> 
</template>


<style>
  .asset-development-chart {
    width: 100%;
    height: 45vh;
    min-height: 300px;
    max-height: 600px;
  }

  .asset-development-chart * {
    max-height: 100%;
    width: 100%;
  }

  .group-pie-chart {
    width: 45vh;
    max-width: 100%;
    display: inline-block;
  }

  .earnings-expenditures-comparison-chart {
    width: 100%;
    height: 45vh;
    min-height: 300px;
    max-height: 600px;
  }

  .earnings-expenditures-comparison-chart * {
    max-height: 100%;
    width: 100%;
  }
</style>