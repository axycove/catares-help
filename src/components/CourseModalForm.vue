<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">
        {{ 'Manage Course Listings for the year ' + selectedYear }}
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
            v-if="repos.courseList[selectedYear] != undefined"
            :data="repos.courseList[selectedYear].data"
            :columns="courseColumns"
            focusable
            checkable
            :checked-rows.sync="checkedRows"
            striped
          >
            <template #empty>
              <div class="has-text-centered">No records</div>
            </template>
          </b-table>
        </b-tab-item>
        <b-tab-item label="Entry">
          <b-field label="Code">
            <b-input ref="codeTextbox" v-model="course.code" :title="course.code"></b-input>
          </b-field>
          <b-field label="Title">
            <b-input v-model="course.title" :title="course.title"></b-input>
          </b-field>
          <b-field label="Credits">
            <b-select placeholder="Select credits..." v-model="course.credits">
              <option
                :value="option"
                v-for="(option, index) in Array.from(Array(10).keys())"
                :key="index"
              >
                {{ option }}
              </option>
            </b-select>
            <b-button @click="saveCourse" type="is-primary" icon-left="check">Add</b-button>
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
    repos: {
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
        return `${this.course.code.trim()} : ${this.course.title.trim()}`;
      }
      return '';
    },
  },
  data() {
    return {
      checkedRows: [],
      course: {
        code: '',
        title: '',
        credits: -1,
      },
      gradeColumns: [
        {
          field: 'id',
          label: 'ID',
        },
        {
          field: 'gradeLetter',
          label: 'Grade Letter',
        },
      ],
      courseColumns: [
        {
          field: 'id',
          label: 'ID',
        },
        {
          field: 'code',
          label: 'Code',
        },
        {
          field: 'title',
          label: 'Title',
        },
        {
          field: 'credits',
          label: 'Credits',
        },
      ],
    };
  },
  methods: {
    saveCourse() {
      let exists = false;

      if (this.course.code === '' || this.course.title === '' || this.course.credits === '') {
        this.$refs.codeTextbox.focus();
        return;
      }

      if (this.repos.courseList[this.selectedYear].data.length) {
        this.repos.courseList[this.selectedYear].data.every((element) => {
          if (element.code === this.course.code) {
            exists = true;
            return false;
          }
        });
      }

      if (!exists) {
        this.course.id = this.repos.courseList[this.selectedYear].data.length + 1;
        this.repos.courseList[this.selectedYear].data.push(this.course);
      }

      this.course = {
        code: '',
        title: '',
        credits: 0,
      };
      this.$refs.codeTextbox.focus();

      this.$emit('store-progs');
    },
    deleteRows() {
      const data = this.repos.courseList[this.selectedYear].data;
      this.checkedRows.forEach((row) => {
        data.splice(data.indexOf(row), 1);
      });
      this.checkedRows = [];

      this.$emit('store-progs');
    },
  },
};
</script>
