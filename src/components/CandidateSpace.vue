<template>
  <section class="section" style="padding-top: 0">
    <b-button
      type="is-outlined is-dark"
      icon-left="account-plus"
      @click="init"
      v-if="selectedProg && selectedYear"
      >Add Candidate</b-button
    >
    <hr />
    <template v-if="courseList.length">
      <div class="columns">
        <div class="is-half" style="padding-left: 10px">
          <b-field grouped>
            <b-select
              placeholder="Select course..."
              v-model="selectedCourses"
              multiple
              native-size="8"
            >
              <option
                :value="option"
                v-for="option in courseList"
                :key="option.code"
              >
                {{ option.code + " : " + option.title }}
              </option>
            </b-select>

            <b-select placeholder="Select dataset..." v-model="dataset">
              <option :value="option" v-for="option in datasets" :key="option">
                {{ option }}
              </option>
            </b-select>
          </b-field>
          <b-button
            type="is-primary"
            icon-left="check-outline"
            @click="addToTable"
            >Add to Table</b-button
          >
        </div>
        <div
          class="is-half"
          style="
            margin-left: 10px;
            padding-left: 10px;
            border-left: 1px solid #ccc;
          "
        >
          <b-field>
            <b-table
              :data="data"
              ref="table"
              detailed
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
                width="500"
                >{{ props.row.description }}</b-table-column
              >
              <b-table-column
                centered
                field="grade"
                label="Grade"
                v-slot="props"
                >{{ props.row.grade }}</b-table-column
              >
              <b-table-column
                centered
                field="credits"
                label="Credits"
                v-slot="props"
                >{{ props.row.credits }}</b-table-column
              >
              <b-table-column
                centered
                field="points"
                label="Points"
                v-slot="props"
                >{{ props.row.points }}</b-table-column
              >
              <b-table-column
                centered
                field="gradePoints"
                label="Grade Points"
                v-slot="props"
                >{{ props.row.gradePoints }}</b-table-column
              >
              <b-table-column centered>
                <template v-slot:default="{ row }">
                  <b
                    >{{
                      `GPA = ${
                        row.gradePoints > 0
                          ? fmtNum(row.gradePoints / row.credits)
                          : 0
                      }`
                    }}
                  </b>
                </template>
              </b-table-column>
              <template slot="detail" slot-scope="props">
                <tr v-for="item in props.row.items" :key="item.code">
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
                    {{ item.gradePoints }}
                  </td>
                  <td>
                    <b-field grouped>
                      <b-button
                        icon-left="arrow-up"
                        @click="changeGrade(item)"
                        type="is-success is-rounded"
                        size="is-small"
                      ></b-button>
                      <b-button
                        icon-left="arrow-down"
                        @click="changeGrade(item, false)"
                        type="is-danger is-rounded"
                        size="is-small"
                        style="margin-left: 5px"
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
        <div class="content is-dark" style="margin: 15px">
          <h6>SUMMARY</h6>
          <p>
            CTGP : <b>{{ totals.totalgradepoints }}</b>
            <br />
            CTUR : <b>{{ totals.totalcredits }}</b>
            <br />
            CGPA : <b>{{ fmtNum(totals.CGPA) }}</b>
          </p>
        </div>
      </div>
    </template>
  </section>
</template>

<script>
export default {
  computed: {
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
      selectedCourses: []
    }
  },
  methods: {
    init() {
      const dbEntryName = 'catares-' + this.selectedProg.toLowerCase()
      const parsedList = localStorage[dbEntryName] ? JSON.parse(localStorage[dbEntryName]).courseList : null
      if (parsedList) this.courseList = parsedList[this.selectedYear].data
    },
    addToTable() {
      if (!this.dataset) return
      let group = this.data.find(({ description }) => description == this.dataset)

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
        if (!group.items.find(item => item.code.split('_')[0] == course.code)) {
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
    },
    changeGrade(obj, upwards = true) {
      const gradeList = this.gradeList[this.dataset.split('_')[0]]
      if (gradeList) {
        const grade = gradeList.data.find(item => item.letter == obj.grade)
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
        const dataset = this.data.find(d => d.description == this.dataset)
        dataset.credits = dataset.points = dataset.gradePoints = 0
        dataset.items.forEach(row => {
          dataset.credits += row.credits
          dataset.points += row.points
          dataset.gradePoints += row.gradePoints
        })
      } else {
        this.$buefy.toast.open({
          duration: 5000,
          message: `You've not create a grades list for the year ${this.dataset.split('_')[0]}`,
          position: 'is-bottom',
          type: 'is-danger'
        })
      }
    },
    fmtNum(value) {
      return Number(Math.round(parseFloat(value) + 'e2') + 'e-2')
    }
  }
}
</script>