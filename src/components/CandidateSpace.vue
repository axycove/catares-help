<template>
  <section class="section" style="padding-top: 0">
    <template v-if="displayTop">
      <b-button
        type="is-outlined is-dark is-rounded"
        icon-left="animation"
        @click="showCandidateListDialog"
        v-if="selectedProg && selectedYear"
        >Load Candidate</b-button
      >
      <hr />
    </template>
    <p class="content cand-info" v-show="!displayTop">
      <span class="has-text-grey-dark has-background-light">{{ dispayName }}</span>
    </p>
    <div class="block">
      <b-button
        @click="
          $emit('show-top', true);
          saveWork();
        "
        v-if="!displayTop"
        icon-left="arrow-down"
        type="is-rounded"
        style="margin-top: 10px"
        >{{ tableUpdated ? "Save Work &" : "" }} Hide Space</b-button
      >
    </div>
    <template v-if="courseList.length && !displayTop">
      <div class="columns">
        <div class="column">
          <b-field grouped group-multiline>
            <b-select
              placeholder="Select course..."
              v-model="selectedCourses"
              multiple
              native-size="12"
            >
              <option
                :value="option"
                v-for="option in courseList"
                :key="option.code"
              >
                {{ option.code + " : " + option.title }}
              </option>
            </b-select>
          </b-field>

          <!-- <hr> -->
          <b-field grouped group-multiline>
            <b-field>
              <b-button
                type="is-primary is-rounded"
                icon-left="check-outline"
                @click="addToTable"
                >Add to Table</b-button
              >
            </b-field>
            <b-select placeholder="Dataset..." v-model="dataset">
              <option :value="option" v-for="option in datasets" :key="option">
                {{ option }}
              </option>
            </b-select>
            <b-select
              placeholder="Pass grade..."
              v-model="passGrade"
              v-if="bypassGradeYear || dataset"
            >
              <option
                :value="option.letter"
                v-for="option in gradeList[
                  bypassGradeYear ? bypassGradeYear : dataset.split('_')[0]
                ].data"
                :key="option.id"
              >
                {{ option.letter }}
              </option>
            </b-select>
          </b-field>

          <!-- </b-field> -->
          <b-field label="Grade Scheme Bypass">
            <div class="block">
              <b-radio
                v-model="bypassGradeYear"
                name="gradeYear"
                :native-value="gy"
                :key="gy"
                v-for="gy in gradeYears"
              >
                {{ gy }}
              </b-radio>
            </div>
          </b-field>
        </div>
        <div class="table-container">
          <b-field>
            <b-table
              :data="data"
              ref="table"
              detailed
              striped
              hoverable
              custom-detail-row
              detail-key="description"
              @details-open="
                (row, index) => $buefy.toast.open(`Expanded ${row.description}`)
              "
            >
              <b-table-column
                field="description"
                label="Description"
                v-slot="props"
                width="600"
                ><b>{{ props.row.description }}</b></b-table-column
              >
              <b-table-column
                centered
                field="grade"
                label="Grade"
                v-slot="props"
                ><b>{{ props.row.grade }}</b></b-table-column
              >
              <b-table-column
                centered
                field="credits"
                label="Credits"
                v-slot="props"
                ><b>{{ props.row.credits }}</b></b-table-column
              >
              <b-table-column
                centered
                field="points"
                label="Points"
                v-slot="props"
                ><b>{{ props.row.points }}</b></b-table-column
              >
              <b-table-column
                centered
                field="gradePoints"
                label="Grade Points"
                v-slot="props"
                ><b>{{ fmtNum(props.row.gradePoints) }}</b></b-table-column
              >
              <b-table-column centered>
                <template v-slot:default="{ row }">
                  <b
                    >{{
                      `GPA: ${
                        row.gradePoints > 0
                          ? fmtNum(row.gradePoints / row.credits)
                          : 0
                      }`
                    }}
                  </b>
                </template>
              </b-table-column>
              <template slot="detail" slot-scope="props">
                <tr
                  v-for="item in props.row.items"
                  :key="item.code"
                  :style="item.grade > passGrade ? 'color: #f14668' : ''"
                  :class="markGoodRetake(item) ? 'has-text-primary' : ''"
                >
                  <td></td>
                  <td>&nbsp;&nbsp;&nbsp;&nbsp;{{ item.description }}</td>
                  <td class="has-text-centered">
                    {{ item.grade }}
                  </td>
                  <td class="has-text-centered">
                    {{ item.credits }}
                  </td>
                  <td class="has-text-centered">
                    {{ item.points }}
                  </td>
                  <td class="has-text-centered">
                    {{ fmtNum(item.gradePoints) }}
                  </td>
                  <td>
                    <b-field grouped>
                      <b-button
                        icon-left="arrow-up"
                        @click="changeGrade(item)"
                        type="is-primary is-rounded"
                        size="is-small"
                        style="display: table"
                      ></b-button>
                      <b-button
                        icon-left="arrow-down"
                        @click="changeGrade(item, false)"
                        type="is-danger is-rounded"
                        size="is-small"
                        style="margin-left: 5px; display: table"
                      ></b-button>
                    </b-field>
                  </td>
                </tr>
              </template>
              <template #empty>
                <div class="has-text-centered">No records</div>
              </template>
            </b-table>
          </b-field>
        </div>
        <div class="content is-summary has-text-danger-light">
          <p
            class="
              heading
              is-italic
              has-text-grey-dark has-background-primary-light has-text-centered
            "
          >
            SUMMARY
          </p>
          <p class="detail">
            CTGP : <b>{{ totals.totalgradepoints }}</b>
            <br />
            CTUR : <b>{{ totals.totalcredits }}</b>
            <br />
            CGPA : <b>{{ fmtNum(totals.CGPA) }}</b>
          </p>
          <template v-if="collatedCarryovers.length">
            <p
              class="heading is-italic has-background-danger has-text-centered"
            >
              CARRY OVERS
            </p>
            <p class="detail">{{ collatedCarryovers }}</p>
          </template>
        </div>
      </div>
    </template>
  </section>
</template>

<script>
import CandidateListModalForm from './CandidateListModalForm'
import { getResults, getProgs, postResults } from '../services/api'

export default {
  computed: {
    dispayName() {
      return this.candidate.split('$')[0]
    },
    datasets() {
      const array = []
      this.sessions.map(element => {
        array.push(element.id + '_1')
        array.push(element.id + '_2')
      })
      return array
    },
    totals() {
      let totalcredits = 0, totalgradepoints = 0
      this.data.forEach(dataset => {
        totalcredits += dataset.credits
        totalgradepoints += dataset.gradePoints
      })
      return {
        CGPA: totalgradepoints > 0 ? totalgradepoints / totalcredits : 0,
        totalcredits, totalgradepoints
      }
    },
    gradeYears() {
      return Object.keys(this.gradeList)
    },
    collatedCarryovers() {
      const carryovers = []
      this.data.forEach(dataset => {
        dataset.items.forEach(result => {
          let courseCode = result.code.split('_')[0]
          let foundIndex = carryovers.indexOf(courseCode)
          if (this.passGrade < result.grade) {
            if (foundIndex === -1) carryovers.push(courseCode)
          } else if (foundIndex !== -1) {
            this.passedCarryovers.push({
              courseCode,
              dataset: result.code.split('_').splice(1, 2).join('_')
            })
            carryovers.splice(foundIndex, 1)
          }
        })
      })
      return carryovers.join(', ')
    }
  },
  props: {
    gradeList: {
      type: Object,
      required: true
    },
    selectedProg: {
      type: String,
      required: true
    },
    selectedYear: {
      type: Number,
      required: true
    },
    sessions: {
      type: Array,
      required: true
    },
    displayTop: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      data: [],
      courseList: [],
      course: {
        code: '',
        title: '',
        credits: -1
      },
      dataset: null,
      selectedCourses: [],
      bypassGradeYear: '',
      candidate: '',
      passGrade: null,
      passedCarryovers: [],
      tableUpdated: false
    }
  },
  methods: {
    async initDb() {
      let repos = null
      await getProgs(this.selectedProg.toLowerCase())
        .then(data => repos = data)
      const parsedList = repos ? repos.courseList : null
      if (parsedList) this.courseList = parsedList[this.selectedYear].data
      this.$emit('show-top', false)
    },
    addToTable() {
      if (!this.dataset) return

      let group = this.data.find(({ description }) => description === this.dataset)

      if (group === undefined) {
        group = {}
        group.items = []
        group.description = this.dataset
        group.credits = 0
        group.grade = '*'
        group.points = 0
        group.gradePoints = 0
      } else {
        this.data.splice(this.data.indexOf(group), 1)
      }

      this.selectedCourses.forEach(course => {
        if (!group.items.find(item => item.code.split('_')[0] === course.code)) {
          group.items.push(
            {
              code: course.code + '_' + this.dataset,
              description: course.code + ' : ' + course.title,
              credits: course.credits,
              grade: 'F',
              points: 0,
              gradePoints: 0
            })
        }
      })

      this.data.push(group)
      this.selectedCourses = []
      this.tableUpdated = true
    },
    async changeGrade(obj, upwards = true) {
      const gradeList = this.gradeList[this.bypassGradeYear ? this.bypassGradeYear : this.dataset.split('_')[0]]
      if (gradeList) {
        const grade = gradeList.data.find(item => item.letter === obj.grade)
        let position = gradeList.data.indexOf(grade)
        let newGrade
        if (upwards) {
          newGrade = position > 0 ? gradeList.data[--position] : grade
        } else {
          newGrade = position != (gradeList.data.length - 1) ? gradeList.data[++position] : grade
        }

        obj.grade = newGrade.letter
        obj.points = newGrade.points
        obj.gradePoints = newGrade.points * obj.credits

        // update totals
        const dataset = this.data.find(d => d.description == obj.code.split('_').splice(-2, 2).join('_'))
        dataset.credits = dataset.points = dataset.gradePoints = 0
        dataset.items.forEach(row => {
          dataset.credits += row.credits
          dataset.points += row.points
          dataset.gradePoints += row.gradePoints
        })

        this.tableUpdated = true
      } else {
        this.$buefy.toast.open({
          duration: 5000,
          message: `You've not created a grades list for the year ${this.dataset.split('_')[0]}, or bypass.`,
          position: 'is-bottom',
          type: 'is-danger'
        })
      }
    },
    fmtNum(value) {
      return Number(Math.round(parseFloat(value) + 'e2') + 'e-2').toFixed(2)
    },

    showCandidateListDialog() {
      this.$buefy.modal.open({
        parent: this,
        component: CandidateListModalForm,
        props: { selectedProg: this.selectedProg },
        hasModalCard: true,
        events: {
          'init-space': (val) => {
            this.initSpace(val)
          }
        }
      })
    },
    async initSpace(cand) {
      this.initDb()
      this.candidate = cand
      let results = null
      await getResults(cand)
        .then(data => results = data)
      if (results && cand) {
        this.data = results ? results : []
      }

      this.$buefy.toast.open({
        duration: 5000,
        type: 'is-success',
        message:
          `Candidate space loaded for ${this.dispayName}.`
      })
    },
    markGoodRetake(resultRow) {
      let passedRetake = false
      this.passedCarryovers.forEach(pc => {
        if (!passedRetake) {
          passedRetake = pc.courseCode == resultRow.code.split('_')[0] &&
            pc.dataset == resultRow.code.split('_').splice(1, 2).join('_')
        }
      })
      return passedRetake
    },
    async saveWork() {
      if (this.tableUpdated)
        await postResults(this.candidate, this.data)
    }
  }
}
</script>
<style>
.content.is-summary {
  margin: 5px;
  margin-left: 5px;
  padding: 10px;
  border-radius: 5px;
  height: max-content;
  margin-left: 10px;
  background: #7957d5;
  box-shadow: 2px 2px #595656;
  max-width: 15rem;
  min-width: 10rem;
  padding: 0.5rem 0.8rem;
}

.is-summary .heading {
  font-weight: bold;
  font-size: 0.8rem;
  margin-bottom: 0.5em !important;
}

.content.cand-info {
  float: right;
  margin-top: 20px;
  position: absolute;
  right: 1.2rem;
  font-size: 1.2rem;
  font-weight: bold;
}

.content.cand-info span {
  border: 1px solid #ddd;
  padding: 2px 6px;
  border-radius: 3px;
  position: relative;
  top: -10px;
  display: block;
}

td .field.is-grouped {
  justify-content: center !important;
}

.table-container {
  border-left: 1px solid #ccc;
}

@media only screen and (max-width: 600px) {
  .column {
    padding: 0 !important;
  }

  .content.cand-info {
    position: inherit;
  }

  .select select[multiple] option {
    min-width: 88vw;
  }
}

@media only screen and (max-width: 915px) {
  section {
    display: flex !important;
    flex-direction: column;
  }

  .content.cand-info {
    margin-top: 0;
    position: inherit;
  }

  .columns {
    flex-direction: column;
  }

  .content.is-summary {
    margin-left: 0;
    margin-top: 1em;
    width: 25vw;
  }

  .field .block {
    margin-bottom: 10px;
  }

  .table-container {
    border-left: none;
  }
}
</style>