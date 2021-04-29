<template>
  <div>
    <section class="hero is-primary">
      <div class="hero-body">
        <p class="title">Catastrophic Results Helper :: <i>catares-help</i></p>
        <p class="subtitle">
          An ad-hoc results compilation system! Made with &#128151; by NixowL.
          :)
        </p>
      </div>
    </section>
    <section class="section" v-show="displayTop">
      <b-field label="Dataset for this compilation" grouped>
        <b-select
          placeholder="Select a programme"
          v-model="selectedProg"
          @input="selectedYear ? initDb : false"
        >
          <option
            v-for="option in programmes"
            :value="option.code"
            :key="option.code"
          >
            {{ option.title }}
          </option>
        </b-select>
        <b-select
          v-if="selectedProg"
          placeholder="Select a session"
          v-model="selectedYear"
          @input="initDb"
        >
          <option
            v-for="option in sessions"
            :value="option.id"
            :key="option.id"
          >
            {{ option.id }}
          </option>
        </b-select>
      </b-field>
      <div class="buttons">
        <b-button class="is-primary" icon-left="plus" @click="addCourseDialog"
          >Add Courses</b-button
        >
        <b-button class="is-danger" icon-left="plus" @click="addGradeDialog"
          >Add Grades</b-button
        >
      </div>
    </section>
    <CandidateSpace
      :selectedProg="selectedProg"
      :selectedYear="selectedYear"
      :sessions="sessions"
      :gradeList="gradeList"
      @show-top="showTop"
      :displayTop="displayTop"
    />
  </div>
</template>

<script>
import CourseModalForm from './CourseModalForm'
import GradeModalForm from './GradeModalForm.vue'
import CandidateSpace from './CandidateSpace.vue'

export default {
  components: {
    CandidateSpace
  },
  computed: {},
  data() {
    return {
      repos: {
        courseList: {},
      },
      gradeList: {},
      sessions: [],
      programmes: [
        { code: 'ACCHFT', title: 'Accounting HND Fulltime' },
        { code: 'ACCHPT', title: 'Accounting HND Parttime' },
        { code: 'ACCNFT', title: 'Accounting ND Fulltime' },
        { code: 'ACCNPT', title: 'Accounting ND Parttime' },
        { code: 'QUSHFT', title: 'Quantity Surveying HND Fulltime' },
        { code: 'QUSHPT', title: 'Quantity Surveying HND Parttime' },
        { code: 'QUSNFT', title: 'Quantity Surveying ND Fulltime' },
        { code: 'QUSNPT', title: 'Quantity Surveying ND Parttime' },
      ],
      selectedYear: 0,
      selectedProg: '',
      displayTop: true,
    }
  },
  methods: {
    populate() {
      let startYear = 2002, endYear = new Date().getFullYear()
      for (let index = startYear; index < endYear + 1; index++) {
        this.sessions.push({ id: index })
      }
    },
    addCourseDialog() {
      this.$buefy.modal.open({
        parent: this,
        component: CourseModalForm,
        props: { repos: this.repos, selectedYear: this.selectedYear },
        hasModalCard: true,
        events: {
          'store-db': () => this.storeDb()
        }
      })
    },
    addGradeDialog() {
      this.$buefy.modal.open({
        parent: this,
        component: GradeModalForm,
        props: { gradeList: this.gradeList, selectedYear: this.selectedYear },
        hasModalCard: true,
        events: {
          'store-db': () => this.storeDb()
        }
      })
    },
    initDb() {
      const entryName = 'catares-' + this.selectedProg.toLowerCase()
      if (localStorage['catares-grades']) this.gradeList = JSON.parse(localStorage['catares-grades'])
      if (localStorage[entryName]) {
        this.repos = JSON.parse(localStorage[entryName])
      } else {
        let courseList = this.repos.courseList[this.selectedYear]
        this.repos.courseList[this.selectedYear] = courseList != undefined ? courseList : { data: [] }
        let gradeList = this.gradeList[this.selectedYear]
        this.gradeList[this.selectedYear] = gradeList != undefined ? gradeList : { data: [] }
      }
    },
    storeDb() {
      const entryName = 'catares-' + this.selectedProg.toLowerCase()
      localStorage[entryName] = JSON.stringify(this.repos)
      if (this.gradeList) {
        localStorage['catares-grades'] = JSON.stringify(this.gradeList)
      }
    },
    showTop(val) {
      this.displayTop = val
    }
  },
  created() {
    this.populate()
  },
}
</script>

<style scoped>
</style>