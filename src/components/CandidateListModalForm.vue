<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">Processed Candidate Listings in Repository</p>
    </header>
    <section class="modal-card-body">
      <b-field grouped group-multiline>
        <b-button
          label="Delete checked"
          type="is-danger"
          icon-left="close"
          class="field"
          @click="deleteRows"
          v-if="checkedRows.length"
        />
      </b-field>
      <b-tabs>
        <b-tab-item label="Table">
          <b-table :data="candidateList" focusable striped>
            <b-table-column field="id" label="ID" v-slot="props">{{
              props.row.id
            }}</b-table-column>
            <b-table-column
              field="name"
              label="Candidate's name"
              v-slot="props"
              >{{ props.row.name }}</b-table-column
            >
            <b-table-column
              field="datasets"
              label="Active datasets"
              v-slot="props"
              >{{ props.row.datasets }}</b-table-column
            >
            <b-table-column>
              <template v-slot:default="{ row }">
                <b-field>
                  <b-button
                    type="is-danger is-rounded"
                    icon-left="trash-can"
                    style="margin-right: 5px"
                    @click="deleteRow(row)"
                  ></b-button>
                  <b-button
                    type="is-primary is-rounded"
                    icon-left="animation"
                    @click="initSpace(row.name)"
                    >Load</b-button
                  >
                </b-field>
              </template>
            </b-table-column>
            <template #empty>
              <div class="has-text-centered">No records</div>
            </template>
          </b-table>
        </b-tab-item>
        <b-tab-item label="Entry">
          <b-field label="Candidate's name">
            <b-input
              ref="candNameTextbox"
              v-model="candidate"
              :title="candidate"
            ></b-input>
          </b-field>
          <b-button
            @click="initSpace(candidate)"
            icon-left="check"
            type="is-primary"
            >Add</b-button
          >
        </b-tab-item>
      </b-tabs>
    </section>
    <footer class="modal-card-foot">
      <button class="button" type="button" @click="$parent.close()">
        Close
      </button>
    </footer>
  </div>
</template>

<script>
export default {
  computed: {
    candidateList() {
      const array = []
      if (localStorage['catares-results']) {
        const results = JSON.parse(localStorage['catares-results'])
        const resKeys = Object.keys(JSON.parse(localStorage['catares-results']))
        let i = 0
        resKeys.forEach(rk => {
          var datasets = []
          results[rk].forEach(ds => {
            datasets.push(ds.description)
          })
          array.push({
            id: ++i,
            name: rk,
            datasets: datasets.join(',')
          })
        })
      }
      return array
    }
  },
  data() {
    return {
      checkedRows: [],
      candidate: ''
    }

  },
  methods: {
    initSpace(val) {
      this.$emit('init-space', val)
      this.$parent.close()
    },
    deleteRow(row) {
      this.$buefy.dialog.confirm({
        title: 'Deleting candidate',
        message: `Are you sure you want to <b>delete</b> this candidate? This action cannot be undone.`,
        confirmText: 'Delete Candidate',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: () => {
          if (localStorage['catares-results']) {
            const results = JSON.parse(localStorage['catares-results'])
            delete results[row.name]
            localStorage['catares-results'] = JSON.stringify(results)
          }
          this.$buefy.toast.open('Candidate delete!')
        }
      })

    }
  }
}
</script>

<style>
</style>