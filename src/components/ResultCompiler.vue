<template>
  <div>
    <section class="hero is-primary">
      <div class="hero-body">
        <p class="image is-32x32">
          <img src="/image/ch-logo-64x64.png" />
        </p>

        <p class="title">Catasys Results Helper :: <i>catares-help</i></p>
        <p class="subtitle">
          An ad-hoc results compilation system! Made with &#128151; by 0x4b656e.
          :)
        </p>
      </div>
    </section>
    <section class="section" v-show="displayTop">
      <b-field label="Dataset for this compilation" grouped>
        <b-select
          placeholder="Select a programme"
          v-model="selectedProg"
          @input="initDb"
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
        <b-button
          class="is-primary is-rounded is-outlined"
          :disabled="isLoading"
          icon-left="plus-box-multiple-outline"
          @click="addCourseDialog"
          >Add Courses</b-button
        >
        <b-button
          class="is-danger is-rounded is-outlined"
          :disabled="isLoading"
          icon-left="plus-box-multiple-outline"
          @click="addGradeDialog"
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
import GradeModalForm from './GradeModalForm'
import CandidateSpace from './CandidateSpace'
import { getGrades, postGrades, postProgs, getProgs } from '../services/api'

export default {
  components: {
    CandidateSpace
  },
  data() {
    return {
      repos: {
        courseList: {},
      },
      gradeList: {},
      sessions: [],
      programmes: [
        { code: 'ABENFT', title: 'Agric/Bio-Environmental Engineering ND Fulltime' },
        { code: 'ABEHFT', title: 'Agric/Bio-Environmental Engineering HND Fulltime' },
        { code: 'ACCNFT', title: 'Accounting ND Fulltime' },
        { code: 'ACCNPT', title: 'Accounting ND Parttime' },
        { code: 'ACCHFT', title: 'Accounting HND Fulltime' },
        { code: 'ACCHPT', title: 'Accounting HND Parttime' },
        { code: 'CEGNFT', title: 'Computer Engineering ND Fulltime' },
        { code: 'CEGHFT', title: 'Computer Engineering HND Fulltime' },
        { code: 'EEENFT', title: 'Electrical/Electronics Engineering ND Fulltime' },
        { code: 'EEEHFT', title: 'Electrical/Electronics Engineering HND Fulltime' },
        { code: 'QUSNFT', title: 'Quantity Surveying ND Fulltime' },
        { code: 'QUSNPT', title: 'Quantity Surveying ND Parttime' },
        { code: 'QUSHFT', title: 'Quantity Surveying HND Fulltime' },
        { code: 'QUSHPT', title: 'Quantity Surveying HND Parttime' },
      ],
      selectedYear: 0,
      selectedProg: '',
      displayTop: true,
      isLoading: false
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
          'store-progs': () => this.storeProgs()
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
          'store-gradeslist': () => this.storeGradesList()
        }
      })
    },
    async initDb() {
      if (this.selectedYear && this.selectedProg) {
        this.isLoading = true
        await getGrades()
          .then(data => this.gradeList = data)

        await getProgs(this.selectedProg.toLowerCase())
          .then(data => this.repos = data)

        if (!('courseList' in this.repos && this.repos['courseList'][this.selectedYear])) {
          this.repos['courseList'] = {
            [this.selectedYear]: { data: [] }
          }

          if (!(this.selectedYear in this.gradeList)) {
            this.gradeList[this.selectedYear] = { data: [] }
          }
        }
        this.isLoading = false
      }
    },
    storeProgs() {
      postProgs(this.selectedProg.toLowerCase(), this.repos)
    },
    storeGradesList() {
      if (this.gradeList) postGrades(this.gradeList)
    },
    showTop(val) {
      this.displayTop = val
    }
  },
  created() {
    this.populate()
  }
}
</script>

<style>
.image.is-32x32 {
  margin-left: -3px;
  top: -20px;
}
</style>