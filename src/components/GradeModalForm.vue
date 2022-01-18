<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">
        {{ 'Manage Grade Listings for the year ' + selectedYear }}
      </p>
    </header>
    <section class="modal-card-body">
      <b-field grouped group-multiline>
        <b-button
          label="Delete checked"
          type="is-danger is-rounded"
          icon-left="close"
          class="field"
          @click="deleteRows"
          v-if="checkedRows.length"
        />
      </b-field>
      <b-tabs>
        <b-tab-item label="Table">
          <b-table
            v-if="Boolean(gradeList[selectedYear])"
            :data="gradeList[selectedYear].data"
            :columns="gradeColumns"
            focusable
            checkable
            striped
            :checked-rows.sync="checkedRows"
          >
            <template #empty>
              <div class="has-text-centered">No records</div>
            </template>
          </b-table>
        </b-tab-item>
        <b-tab-item label="Entry">
          <b-field label="Grade Letter">
            <b-input ref="gradeTextbox" v-model="grade.letter" :title="grade.letter"></b-input>
          </b-field>
          <b-field label="Points">
            <b-select placeholder="Select points..." v-model="grade.points">
              <option :value="option" v-for="(option, index) in gradePoints" :key="index">
                {{ option }}
              </option>
            </b-select>
            <b-button @click="saveGrade" icon-left="check" type="is-primary">Add</b-button>
          </b-field>
        </b-tab-item>
      </b-tabs>
    </section>
    <footer class="modal-card-foot">
      <b-button icon-left="close" type="is-rounded" @click="$parent.close()">
        Close
      </b-button>
    </footer>
  </div>
</template>

<script>
export default {
  props: {
    gradeList: {
      type: Object,
      required: true,
    },
    selectedYear: {
      type: Number,
      required: true,
    },
  },
  computed: {
    courseInfo() {
      if (this.course && 'code' in this.course) {
        return `${this.course.code.trim()} : ${this.course.title.trim()}`
      }
      return ''
    },
  },
  data() {
    return {
      grade: {
        letter: '',
        points: 0,
      },
      gradeColumns: [
        {
          field: 'id',
          label: 'ID',
        },
        {
          field: 'letter',
          label: 'Grade Letter',
        },
        {
          field: 'points',
          label: 'Points',
        },
      ],
      gradePoints: [],
      checkedRows: [],
    }
  },
  methods: {
    populate() {
      Array.from('01234').forEach(e => {
        this.gradePoints.push(parseFloat(e))
        this.gradePoints.push(parseFloat(e) + 0.25)
        this.gradePoints.push(parseFloat(e) + 0.5)
        this.gradePoints.push(parseFloat(e) + 0.75)
      })
    },
    saveGrade() {
      let exists = false

      if (this.grade.letter === '' || this.grade.points === '') {
        this.$refs.gradeTextbox.focus()
        return
      }

      if (this.gradeList?.[this.selectedYear].data.length) {
        this.gradeList[this.selectedYear].data.every(element => {
          if (element.letter === this.grade.letter) {
            exists = true
            return false
          }
        })
      }

      if (!exists) {
        this.grade.id = this.gradeList[this.selectedYear].data.length + 1
        this.gradeList[this.selectedYear].data.push(this.grade)
      }

      this.grade = {
        letter: '',
        points: 0,
      }
      this.$refs.gradeTextbox.focus()

      this.$emit('store-gradeslist')
    },
    deleteRows() {
      const data = this.gradeList[this.selectedYear].data
      this.checkedRows.forEach(row => {
        data.splice(data.indexOf(row), 1)
      })
      this.checkedRows = []

      this.$emit('store-gradeslist')
    },
  },
  created() {
    this.populate()
  },
}
</script>

<style></style>
